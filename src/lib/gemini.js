const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function callGemini(parts, apiKey, { responseMimeType } = {}) {
  const generationConfig = {
    temperature: 0.4,
    maxOutputTokens: 1024,
  }
  if (responseMimeType) generationConfig.responseMimeType = responseMimeType

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig,
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error?.message || `API error ${response.status}`) 
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty response from Gemini')
  return text
}

export async function analyzeMealText(mealText, profile, apiKey) {
  const prompt = `You are a clinical nutritionist AI. Analyze this meal and return ONLY valid JSON.

Meal: "${mealText}"
User Profile: Age ${profile.age}, Weight ${profile.weight}kg, Height ${profile.height}cm, Goal: ${profile.goal} weight, Diet: ${profile.dietType}
Target Calories: ~${profile.targetCalories} kcal/day, Protein: ~${profile.proteinNeeds}g/day

Return ONLY this JSON (no markdown, no explanation):
{
  "name": "meal name",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "fiber": number,
  "healthScore": number (0-100),
  "decisionScore": number (0-100, based on goal alignment),
  "decision": "Great Choice" | "Okay Choice" | "Not Ideal",
  "goalAligned": boolean,
  "reason": "1 sentence why",
  "suggestion": "1 actionable improvement",
  "items": ["item1", "item2"],
  "mealType": "Breakfast" | "Lunch" | "Dinner" | "Snack"
}`

  const text = await callGemini([{ text: prompt }], apiKey, { responseMimeType: 'application/json' })
  return parseJSON(text)
}

export async function analyzeMealImage(base64Image, mimeType, profile, apiKey) {
  const prompt = `You are a clinical nutritionist AI. Analyze the food in this image and return ONLY valid JSON.

User Profile: Age ${profile.age}, Weight ${profile.weight}kg, Height ${profile.height}cm, Goal: ${profile.goal} weight, Diet: ${profile.dietType}
Target Calories: ~${profile.targetCalories} kcal/day, Protein: ~${profile.proteinNeeds}g/day

Return ONLY this JSON (no markdown, no explanation):
{
  "name": "meal name",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "fiber": number,
  "healthScore": number (0-100),
  "decisionScore": number (0-100, based on goal alignment),
  "decision": "Great Choice" | "Okay Choice" | "Not Ideal",
  "goalAligned": boolean,
  "reason": "1 sentence why",
  "suggestion": "1 actionable improvement",
  "items": ["item1", "item2"],
  "mealType": "Breakfast" | "Lunch" | "Dinner" | "Snack"
}`

  const text = await callGemini([
    { text: prompt },
    { inlineData: { mimeType, data: base64Image } },
  ], apiKey, { responseMimeType: 'application/json' })
  return parseJSON(text)
}

export async function chatWithNutritionAI(messages, profile, apiKey) {
  const systemContext = `You are NutriSense, a smart, concise nutrition assistant. 
User: ${profile.name || 'User'}, Age ${profile.age}, Goal: ${profile.goal} weight, Diet: ${profile.dietType}.
Target: ${profile.targetCalories} kcal/day, ${profile.proteinNeeds}g protein/day.
Give short, practical, personalized advice. Max 3 sentences. Use bullet points for lists.`

  const conversationHistory = messages.slice(-6).map(m =>
    `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
  ).join('\n')

  const prompt = `${systemContext}\n\nConversation:\n${conversationHistory}\n\nAssistant:`
  return callGemini([{ text: prompt }], apiKey)
}

function parseJSON(text) {
  // Shortened log to avoid truncation issues
  if (text.length > 1000) {
    console.warn('[parseJSON] Input length:', text.length, 'Preview:', text.substring(0, 300));
  } else {
    console.warn('[parseJSON] Input:', text);
  }

  let cleaned = text.replace(/^\uFEFF/, '').replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();

  // Extended wrapper removal
  const wrappers = [
    /^```(?:json)?[\s\S]*?```$/gi,
    /^```[\s\S]*?```$/gi,
    /^{[\s\S]*?}$/s,  // Entire as object
    /^[\s\S]*?\{[\s\S]*\}$/s
  ];
  for (const wrapper of wrappers) {
    cleaned = cleaned.replace(wrapper, match => {
      // Extract inner content
      const innerMatch = match.match(/\{[\s\S]*\}/);
      return innerMatch ? innerMatch[0] : match;
    });
  }
  cleaned = cleaned.trim();

  // Iterative repair
  let jsonStr = cleaned;
  let previous;
  let iterations = 0;
  while (previous !== jsonStr && iterations < 5) {
    previous = jsonStr;
    jsonStr = fixJsonMalformations(jsonStr);
    iterations++;
  }

  // Try parse with increasing tolerance
  const parsers = [
    () => JSON.parse(jsonStr),
    () => {
      // Ultra-minimal fallback
      const minimal = coerceToSchema({ calories: 0 });
      console.warn('[parseJSON] Using minimal fallback schema');
      return minimal;
    }
  ];

  for (const parser of parsers) {
    try {
      const parsed = parser();
      if (parsed && typeof parsed === 'object') {
        console.warn('[parseJSON] Parse success after', iterations, 'iterations');
        return coerceToSchema(parsed);
      }
    } catch (e) {
      console.warn('[parseJSON] Parser failed:', e.message?.substring(0, 100));
    }
  }

  throw new Error('Parse failed after all attempts. Check console logs.');
}

function fixJsonMalformations(str) {
  let fixed = str;

  // Multiple passes for trailing commas
  fixed = fixed.replace(/,\s*([\]}])/g, '$1');
  fixed = fixed.replace(/,\s*([\]}])/g, '$1'); // Double pass

  // Unquoted keys and values
  fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][\w_$]*?)\s*:/g, '$1"$2":');
  // Unquoted string values (basic)
  fixed = fixed.replace(/"([^"]*)"\s*:\s*([a-zA-Z][^\s,}]*?)([,\s}])/, '"$1": "$2"$3');

  // Comments
  fixed = fixed.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

  // Quotes
  fixed = fixed.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

  // Newlines in strings (escape)
  fixed = fixed.replace(/(?<!\\)"([^"\\]|\\.)*?"(?=\s*[,}])/g, match => match.replace(/\n/g, '\\n'));

  // Whitespace
  fixed = fixed.replace(/\s+/g, ' ').trim();

  return fixed;
}

function coerceToSchema(obj) {
  return {
    name: String(obj.name || 'Analyzed Meal'),
    calories: Math.max(0, Number(obj.calories) || 400),
    protein: Math.max(0, Number(obj.protein) || 20),
    carbs: Math.max(0, Number(obj.carbs) || 50),
    fat: Math.max(0, Number(obj.fat) || 15),
    fiber: Math.max(0, Number(obj.fiber) || 5),
    healthScore: Math.max(0, Math.min(100, Number(obj.healthScore) || 65)),
    decisionScore: Math.max(0, Math.min(100, Number(obj.decisionScore || obj.healthScore || 65))),
    decision: (() => {
      const score = Number(obj.decisionScore || 65);
      if (score >= 80) return 'Great Choice';
      if (score >= 50) return 'Okay Choice';
      return 'Not Ideal';
    })(),
    goalAligned: Boolean(obj.goalAligned || (Number(obj.decisionScore || 65) > 60)),
    reason: String(obj.reason || 'Balanced meal with good macro distribution.'),
    suggestion: String(obj.suggestion || 'Add more vegetables for fiber next time.'),
    items: Array.isArray(obj.items) ? obj.items.slice(0, 8) : ['Main dish', 'Side'],
    mealType: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Brunch'].includes(String(obj.mealType)) ? obj.mealType : 'Lunch'
  };
}

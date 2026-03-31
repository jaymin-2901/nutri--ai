import fetch from 'node-fetch';

const text = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAQf8rlRMYO2gYaW7-O8r2gCK7evXHIacE', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        contents: [{ parts: [{ text: 'Return ONLY this JSON, no markdown: {\"name\": \"test\", \"calories\": 100}' }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1024 }
    })
}).then(r => r.json());

console.log(JSON.stringify(text, null, 2));

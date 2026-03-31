import { motion } from 'framer-motion'
import { Brain, Target, Sparkles, BarChart2, Zap, Shield, ChevronRight } from 'lucide-react'

const STEPS = [
  {
    step: '01',
    title: 'You describe or photograph your meal',
    desc: 'Type a description like "dal rice and sabzi" or snap a photo of your plate. NutriSense accepts both text and image input.',
    icon: '📸',
    color: 'from-blue-500 to-blue-600',
  },
  {
    step: '02',
    title: 'Gemini AI extracts nutritional data',
    desc: 'Google\'s Gemini 2.5 Flash model analyzes the food, estimates portion sizes, and calculates macronutrients — calories, protein, carbs, and fat.',
    icon: '🧠',
    color: 'from-purple-500 to-purple-600',
  },
  {
    step: '03',
    title: 'Your profile is used for personalization',
    desc: 'Age, weight, height, goal (lose/gain/maintain), activity level, and diet type are combined to calculate your unique daily targets using the Mifflin-St Jeor equation.',
    icon: '👤',
    color: 'from-amber-500 to-amber-600',
  },
  {
    step: '04',
    title: 'AI Decision Engine scores the meal',
    desc: 'The meal is scored 0–100 based on how well it aligns with your personal goal. A high-protein meal scores higher for muscle gain; low-calorie options score higher for fat loss.',
    icon: '⚡',
    color: 'from-brand-500 to-brand-600',
  },
  {
    step: '05',
    title: 'You get a decision + actionable suggestion',
    desc: 'Instead of just "540 calories", you get "Not Ideal for fat loss — too high in fat, add protein like paneer." Decisions, not just data.',
    icon: '🎯',
    color: 'from-emerald-500 to-emerald-600',
  },
]

const FORMULAS = [
  {
    title: 'BMR (Basal Metabolic Rate)',
    formula: 'BMR = 10W + 6.25H − 5A + 5 (Male)',
    desc: 'Calories burned at complete rest. Based on weight (W), height (H), age (A).',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  {
    title: 'TDEE (Total Daily Energy Expenditure)',
    formula: 'TDEE = BMR × Activity Multiplier',
    desc: 'Actual daily calories needed based on your activity level (1.2 to 1.9×).',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
  },
  {
    title: 'Target Calories',
    formula: 'Lose: TDEE − 500 | Gain: TDEE + 300',
    desc: 'Adjusted based on your goal. A 500kcal deficit safely burns ~0.5kg/week.',
    color: 'bg-brand-50 border-brand-200 text-brand-700',
  },
  {
    title: 'Protein Target',
    formula: 'Protein = Weight × 1.6–2.2g/kg',
    desc: 'Higher protein target (2.2g) for muscle gain; 1.6g for maintenance.',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
  },
]

const FEATURES = [
  { icon: Brain, title: 'Gemini 2.5 Flash', desc: 'Google\'s multimodal AI — understands both text and food images' },
  { icon: Target, title: 'Goal Alignment', desc: 'Every meal is scored against your personal weight goal' },
  { icon: Sparkles, title: 'Contextual Chat', desc: 'Chat assistant uses your full profile for relevant advice' },
  { icon: BarChart2, title: 'Trend Tracking', desc: 'Weekly charts show your nutrition patterns over time' },
  { icon: Zap, title: 'Instant Decisions', desc: 'No waiting — AI decisions appear in under 3 seconds' },
  { icon: Shield, title: 'Privacy First', desc: 'API key and data stored only in your browser, never on servers' },
]

export function HowAIWorks() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-glow-green">
          🧠
        </div>
        <h2 className="text-2xl font-display font-bold text-surface-900 mb-2">How NutriSense AI Works</h2>
        <p className="text-sm text-surface-500 max-w-md mx-auto leading-relaxed">
          A production-grade AI pipeline that transforms meal information into personalized, 
          goal-aware nutrition decisions — powered by Google Gemini.
        </p>
      </motion.div>

      {/* Steps */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="font-display font-bold text-surface-800 mb-4">The 5-Step AI Pipeline</h3>
        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 shadow-sm`}>
                  {step.icon}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-surface-100 mt-2 mb-0 min-h-[20px]" />
                )}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono font-bold text-surface-300">{step.step}</span>
                  <span className="text-sm font-semibold text-surface-800">{step.title}</span>
                </div>
                <p className="text-xs text-surface-500 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Formulas */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="font-display font-bold text-surface-800 mb-1">📐 Science Behind the Numbers</h3>
        <p className="text-xs text-surface-400 mb-4">Clinically validated formulas used to calculate your targets</p>
        <div className="space-y-2">
          {FORMULAS.map(f => (
            <div key={f.title} className={`p-3 rounded-xl border ${f.color}`}>
              <div className="text-xs font-bold mb-1">{f.title}</div>
              <div className="font-mono text-xs bg-white/60 px-2.5 py-1.5 rounded-lg mb-1.5 font-medium">{f.formula}</div>
              <div className="text-xs opacity-75">{f.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Decision scoring */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="font-display font-bold text-surface-800 mb-3">🎯 Decision Score Explained</h3>
        <div className="space-y-3">
          {[
            { range: '70–100', label: 'Great Choice 🟢', desc: 'Well-aligned with your goal. High protein, appropriate calories, good nutrient density.', color: 'border-emerald-200 bg-emerald-50' },
            { range: '40–69', label: 'Okay Choice 🟡', desc: 'Acceptable but not optimal. Some aspects misaligned — perhaps too many carbs or slightly high fat.', color: 'border-amber-200 bg-amber-50' },
            { range: '0–39', label: 'Not Ideal 🔴', desc: 'Poor alignment with your goal. High in unhealthy fats, excess sugar, or heavily processed food.', color: 'border-red-200 bg-red-50' },
          ].map(item => (
            <div key={item.range} className={`p-3 rounded-xl border ${item.color}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-surface-700">{item.label}</span>
                <span className="font-mono text-xs font-bold text-surface-500">{item.range}</span>
              </div>
              <p className="text-xs text-surface-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="font-display font-bold text-surface-800 mb-3">⚡ Platform Features</h3>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map(f => (
            <div key={f.title} className="p-3 bg-surface-50 rounded-xl">
              <f.icon className="w-4 h-4 text-brand-500 mb-1.5" />
              <div className="text-xs font-bold text-surface-700">{f.title}</div>
              <div className="text-xs text-surface-400 mt-0.5 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tech stack */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="p-4 bg-surface-900 rounded-2xl text-sm"
      >
        <h3 className="font-display font-bold text-white mb-3 text-sm">🛠 Tech Stack</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['React + Vite', 'Frontend framework'],
            ['Tailwind CSS', 'Styling'],
            ['Framer Motion', 'Animations'],
            ['Zustand', 'State management'],
            ['Recharts', 'Data visualization'],
            ['Gemini 2.5 Flash', 'AI engine'],
          ].map(([tech, role]) => (
            <div key={tech} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-brand-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-white">{tech}</span>
                <span className="text-xs text-surface-500 ml-1">— {role}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

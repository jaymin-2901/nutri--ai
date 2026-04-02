import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Save, CheckCircle, Flame, Dumbbell, Calculator } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const GOALS = [
  { value: 'lose', label: 'Lose Weight', icon: '📉', desc: 'Caloric deficit, high protein' },
  { value: 'maintain', label: 'Maintain', icon: '⚖️', desc: 'Stay at current weight' },
  { value: 'gain', label: 'Gain Muscle', icon: '💪', desc: 'Caloric surplus, more protein' },
]

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Desk job, little exercise' },
  { value: 'light', label: 'Light', desc: '1-3 days/week exercise' },
  { value: 'moderate', label: 'Moderate', desc: '3-5 days/week exercise' },
  { value: 'active', label: 'Active', desc: '6-7 days/week exercise' },
]

const DIET_TYPES = [
  { value: 'none', label: 'No restriction' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'intermittent', label: 'Intermittent Fasting' },
]

export function Profile() {
  const { profile, updateProfile, profileComplete, resetAll } = useAppStore()
  const [form, setForm] = useState({ ...profile })
  const [saved, setSaved] = useState(false)

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = () => {
    updateProfile(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const bmi = form.weight && form.height
    ? (form.weight / ((form.height / 100) ** 2)).toFixed(1)
    : null

  const bmiCategory = bmi
    ? bmi < 18.5 ? { label: 'Underweight', color: 'text-blue-600' }
      : bmi < 25 ? { label: 'Normal', color: 'text-brand-600' }
        : bmi < 30 ? { label: 'Overweight', color: 'text-amber-600' }
          : { label: 'Obese', color: 'text-red-600' }
    : null

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-2xl">
          {form.name ? form.name.charAt(0).toUpperCase() : '👤'}
        </div>
        <div>
          <h2 className="font-display font-bold text-surface-900">{form.name || 'Your Profile'}</h2>
          <p className="text-sm text-surface-400">
            {profileComplete ? '✅ Profile complete · AI decisions personalized' : '⚠️ Complete profile for personalized AI'}
          </p>
        </div>
      </motion.div>

      {/* Basic info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-5 space-y-4"
      >
        <h3 className="font-display font-semibold text-surface-800 text-sm">Basic Information</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs font-semibold text-surface-500 mb-1 block">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Your name"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-surface-500 mb-1 block">Age</label>
            <input
              type="number"
              value={form.age}
              onChange={e => update('age', e.target.value)}
              placeholder="25"
              min="10" max="100"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-surface-500 mb-1 block">Gender</label>
            <select value={form.gender} onChange={e => update('gender', e.target.value)} className="input-field">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-surface-500 mb-1 block">Weight (kg)</label>
            <input
              type="number"
              value={form.weight}
              onChange={e => update('weight', e.target.value)}
              placeholder="70"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-surface-500 mb-1 block">Height (cm)</label>
            <input
              type="number"
              value={form.height}
              onChange={e => update('height', e.target.value)}
              placeholder="170"
              className="input-field"
            />
          </div>
        </div>

        {/* BMI display */}
        {bmi && (
          <div className="flex items-center gap-2 px-3 py-2 bg-surface-50 rounded-xl border border-surface-100">
            <Calculator className="w-4 h-4 text-surface-400" />
            <span className="text-xs text-surface-500">BMI:</span>
            <span className="text-sm font-bold text-surface-800">{bmi}</span>
            <span className={`text-xs font-medium ${bmiCategory?.color}`}>({bmiCategory?.label})</span>
          </div>
        )}
      </motion.div>

      {/* Goal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card rounded-2xl p-5 space-y-3"
      >
        <h3 className="font-display font-semibold text-surface-800 text-sm">Your Goal</h3>
        <div className="grid grid-cols-3 gap-2">
          {GOALS.map(g => (
            <motion.button
              key={g.value}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => update('goal', g.value)}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all duration-200',
                form.goal === g.value
                  ? 'border-brand-400 bg-gradient-to-br from-brand-50 to-emerald-50 shadow-sm'
                  : 'border-surface-200 hover:border-surface-300 bg-white hover:shadow-sm'
              )}
            >
              <span className="text-2xl">{g.icon}</span>
              <span className="text-xs font-semibold text-surface-700">{g.label}</span>
              <span className="text-[10px] text-surface-400 leading-tight">{g.desc}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-5 space-y-3"
      >
        <h3 className="font-display font-semibold text-surface-800 text-sm">Activity Level</h3>
        <div className="grid grid-cols-2 gap-2">
          {ACTIVITY_LEVELS.map(a => (
            <motion.button
              key={a.value}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => update('activityLevel', a.value)}
              className={cn(
                'flex flex-col p-3 rounded-xl border-2 text-left transition-all duration-200',
                form.activityLevel === a.value
                  ? 'border-brand-400 bg-gradient-to-br from-brand-50 to-emerald-50 shadow-sm'
                  : 'border-surface-200 hover:border-surface-300 bg-white hover:shadow-sm'
              )}
            >
              <span className="text-xs font-semibold text-surface-700">{a.label}</span>
              <span className="text-[10px] text-surface-400 mt-0.5">{a.desc}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Diet type */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card rounded-2xl p-5 space-y-3"
      >
        <h3 className="font-display font-semibold text-surface-800 text-sm">Diet Type</h3>
        <div className="flex flex-wrap gap-2">
          {DIET_TYPES.map(d => (
            <button
              key={d.value}
              onClick={() => update('dietType', d.value)}
              className={cn(
                'px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200',
                form.dietType === d.value
                  ? 'border-brand-400 bg-brand-50 text-brand-700'
                  : 'border-surface-200 bg-white text-surface-600 hover:border-surface-300'
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Calculated targets */}
      {profile.targetCalories > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-display font-semibold text-surface-800 text-sm mb-3">
            Your AI-Calculated Targets
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Flame, label: 'Daily Calories', value: profile.targetCalories, unit: 'kcal', color: 'text-orange-600', bg: 'bg-orange-50' },
              { icon: Dumbbell, label: 'Daily Protein', value: profile.proteinNeeds, unit: 'g', color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'BMR', value: profile.bmr, unit: 'kcal', color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'TDEE', value: profile.tdee, unit: 'kcal', color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-xl p-3`}>
                <div className="text-xs text-surface-500 font-medium">{item.label}</div>
                <div className={`text-lg font-display font-bold ${item.color}`}>
                  {item.value} <span className="text-xs font-normal text-surface-400">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Save + Reset */}
      <div className="flex gap-2 pb-6">
        <button onClick={handleSave} className="btn-primary flex-1 justify-center py-3">
          {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Profile</>}
        </button>
        <button
          onClick={() => { if (confirm('Reset all data?')) resetAll() }}
          className="btn-secondary px-4"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

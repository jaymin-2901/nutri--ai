import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Camera, Type, Loader2, AlertCircle, Key,
  ImageIcon, X, Sparkles, ChevronDown
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { analyzeMealText, analyzeMealImage } from '@/lib/gemini'
import { DecisionCard } from '@/components/features/DecisionCard'
import { getMealTypeByTime } from '@/lib/utils'

const MEAL_TYPES = ['Breakfast', 'Brunch', 'Lunch', 'Snack', 'Dinner']

export function MealAnalyzer({ onOpenApiKey }) {
  const { profile, apiKey, addMeal } = useAppStore()
  const [mode, setMode] = useState('text') // 'text' | 'image'
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [mealType, setMealType] = useState(getMealTypeByTime())
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [logged, setLogged] = useState(false)
  const fileRef = useRef()

  const handleImage = (file) => {
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) handleImage(file)
  }, [])

  const analyze = async () => {
    if (!apiKey) { onOpenApiKey(); return }
    if (mode === 'text' && !text.trim()) return
    if (mode === 'image' && !imageFile) return

    setLoading(true)
    setError(null)
    setResult(null)
    setLogged(false)

    try {
      let data
      if (mode === 'text') {
        data = await analyzeMealText(text.trim(), profile, apiKey)
      } else {
        const reader = new FileReader()
        const base64 = await new Promise((res, rej) => {
          reader.onload = (e) => res(e.target.result.split(',')[1])
          reader.onerror = rej
          reader.readAsDataURL(imageFile)
        })
        data = await analyzeMealImage(base64, imageFile.type, profile, apiKey)
      }

      // Normalize fields
      const normalized = {
        name: data.name || text || 'Analyzed Meal',
        calories: Number(data.calories) || 0,
        protein: Number(data.protein) || 0,
        carbs: Number(data.carbs) || 0,
        fat: Number(data.fat) || 0,
        fiber: Number(data.fiber) || 0,
        score: Number(data.decisionScore || data.healthScore) || 50,
        decisionScore: Number(data.decisionScore || data.healthScore) || 50,
        decision: data.decision || 'Okay Choice',
        goalAligned: Boolean(data.goalAligned),
        reason: data.reason || 'Analysis complete.',
        suggestion: data.suggestion || 'Balance your macros for optimal nutrition.',
        items: Array.isArray(data.items) ? data.items : [],
        mealType: data.mealType || mealType,
      }
      setResult(normalized)
    } catch (err) {
      setError(err.message || 'Analysis failed. Check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLog = () => {
    if (!result) return
    addMeal({ ...result, mealType })
    setLogged(true)
    setTimeout(() => {
      setResult(null)
      setText('')
      setImageFile(null)
      setImagePreview(null)
      setLogged(false)
    }, 1500)
  }

  const handleDismiss = () => {
    setResult(null)
    setError(null)
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Mode toggle */}
      <div className="flex gap-1.5 p-1.5 bg-white rounded-xl border border-surface-100 shadow-sm">
        {[
          { id: 'text', icon: Type, label: 'Describe Meal' },
          { id: 'image', icon: ImageIcon, label: 'Upload Photo' },
        ].map(m => (
          <motion.button
            key={m.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setMode(m.id); setResult(null); setError(null) }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === m.id
                ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-sm'
                : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
            }`}
          >
            <m.icon className="w-4 h-4" />
            {m.label}
          </motion.button>
        ))}
      </div>

      {/* Input area */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-surface-800">
            {mode === 'text' ? '🍽️ What did you eat?' : '📸 Upload Food Photo'}
          </h3>
          {/* Meal type selector */}
          <div className="relative">
            <select
              value={mealType}
              onChange={e => setMealType(e.target.value)}
              className="text-xs font-medium text-surface-600 bg-surface-50 border border-surface-200 rounded-lg px-2.5 py-1.5 pr-7 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-300"
            >
              {MEAL_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-surface-400 pointer-events-none" />
          </div>
        </div>

        {mode === 'text' ? (
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="e.g., 2 rotis with paneer bhurji and a glass of lassi, or 'Big Mac with fries and Coke'..."
            rows={4}
            className="input-field resize-none"
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) analyze() }}
          />
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => !imagePreview && fileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
              imagePreview ? 'border-brand-300' : 'border-surface-200 hover:border-brand-300 cursor-pointer'
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleImage(e.target.files?.[0])}
            />
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Food" className="w-full h-48 object-cover rounded-xl" />
                <button
                  onClick={e => { e.stopPropagation(); clearImage() }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-1 rounded-lg">
                  {imageFile?.name}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5 text-surface-400" />
                </div>
                <p className="text-sm font-medium text-surface-600">Drop image or click to browse</p>
                <p className="text-xs text-surface-400 mt-1">JPG, PNG, WEBP supported</p>
              </div>
            )}
          </div>
        )}

        {/* Analyze button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={analyze}
          disabled={loading || (mode === 'text' ? !text.trim() : !imageFile)}
          className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed text-base py-3.5 font-semibold"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing with AI...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Analyze & Get Decision</>
          )}
        </motion.button>

</motion.div>

      {/* Loading skeleton */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-500 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-semibold text-surface-700">Gemini AI is analyzing...</div>
              <div className="text-xs text-surface-400">Calculating macros & goal alignment</div>
            </div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="shimmer-bg rounded-xl h-12" />
          ))}
        </motion.div>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-red-700">Analysis Failed</div>
              <div className="text-xs text-red-600 mt-0.5">{error}</div>
              {error.toLowerCase().includes('api') && (
                <button onClick={onOpenApiKey} className="text-xs text-red-600 underline mt-1">
                  Update API Key
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result: Decision Card */}
      <AnimatePresence>
        {result && !logged && (
          <DecisionCard
            meal={result}
            onAdd={handleLog}
            onDismiss={handleDismiss}
          />
        )}
        {logged && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-10 bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-200 rounded-2xl text-center shadow-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-5xl mb-3"
            >✅</motion.div>
            <h3 className="font-display font-bold text-brand-800 text-lg">Meal Logged!</h3>
            <p className="text-sm text-brand-600 mt-1">Check your dashboard for today's overview.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick ideas */}
      {!result && !loading && mode === 'text' && (
        <div>
          <p className="text-xs text-surface-400 mb-2 font-medium">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Dal rice and sabzi',
              'Poha with chai',
              'Chicken salad bowl',
              '2 eggs omelette',
              'Idli sambhar',
              'Greek yogurt with fruits',
            ].map(s => (
              <button
                key={s}
                onClick={() => setText(s)}
                className="text-xs bg-surface-100 hover:bg-brand-50 hover:text-brand-700 text-surface-600 px-3 py-1.5 rounded-full transition-colors border border-surface-200 hover:border-brand-200"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

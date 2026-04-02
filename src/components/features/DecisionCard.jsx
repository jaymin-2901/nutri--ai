import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Lightbulb, Target, TrendingUp, Sparkles } from 'lucide-react'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { MiniMacro } from '@/components/ui/MacroBar'
import { getDecisionColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function DecisionCard({ meal, onAdd, onDismiss }) {
  const dc = getDecisionColor(meal.decisionScore ?? meal.score ?? 50)
  const score = meal.decisionScore ?? meal.score ?? 50

  const glowClass = score >= 70 ? 'score-glow-green' : score >= 40 ? 'score-glow-amber' : 'score-glow-red'
  const headerGradient = score >= 70
    ? 'from-emerald-500 to-brand-600'
    : score >= 40
    ? 'from-amber-400 to-orange-500'
    : 'from-red-500 to-rose-600'

  const macros = [
    { label: 'Calories', value: meal.calories, unit: 'kcal', color: 'text-orange-600' },
    { label: 'Protein', value: meal.protein, unit: 'g', color: 'text-blue-600' },
    { label: 'Carbs', value: meal.carbs, unit: 'g', color: 'text-amber-600' },
    { label: 'Fat', value: meal.fat, unit: 'g', color: 'text-rose-600' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn('rounded-2xl border-2 overflow-hidden', dc.border, glowClass)}
      style={{ background: 'white' }}
    >
      {/* Gradient header */}
      <div className={cn('bg-gradient-to-r px-5 py-4 text-white', headerGradient)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl backdrop-blur-sm border border-white/20"
              aria-label={`${dc.label} indicator`}
            >
              {dc.icon}
            </div>
            <div>
              <div className="text-base font-display font-bold tracking-tight">{dc.label}</div>
              <div className="text-xs text-white/70 font-medium truncate max-w-[160px]">{meal.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className={cn(
              'flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full',
              'bg-white/20 text-white border border-white/20 backdrop-blur-sm'
            )}>
              {meal.goalAligned
                ? <><CheckCircle className="w-3 h-3" /> Aligned</>
                : <><XCircle className="w-3 h-3" /> Off Goal</>
              }
            </div>
          </div>
        </div>
      </div>

      <div className={cn('px-5 py-4 space-y-4', dc.bg)}>
        {/* Score + Macros row */}
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center gap-1">
            <CircularProgress 
              value={score}
              size={96} 
              strokeWidth={7}
              color={dc.ring}
              label="Score"
            />
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            {macros.map(m => (
              <MiniMacro key={m.label} {...m} />
            ))}
          </div>
        </div>

        {/* Food items */}
        {meal.items && meal.items.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {meal.items.map((item, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="text-xs bg-white border border-surface-200 text-surface-600 px-2.5 py-0.5 rounded-full font-medium shadow-sm"
              >
                {item}
              </motion.span>
            ))}
          </div>
        )}

        {/* AI Reason */}
        <motion.div 
          className="flex gap-3 p-3.5 bg-white rounded-xl border border-surface-100 shadow-sm"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-7 h-7 bg-surface-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-surface-500" />
          </div>
          <div>
            <div className="text-xs font-semibold text-surface-600 mb-0.5">AI Analysis</div>
            <div className="text-sm text-surface-700 leading-relaxed">{meal.reason}</div>
          </div>
        </motion.div>

        {/* Suggestion */}
        <motion.div 
          className="flex gap-3 p-3.5 bg-white rounded-xl border border-surface-100 shadow-sm"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div>
            <div className="text-xs font-semibold text-surface-600 mb-0.5">Suggestion</div>
            <div className="text-sm text-surface-700 leading-relaxed">{meal.suggestion}</div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAdd}
            className="btn-primary flex-1 justify-center py-3"
          >
            <CheckCircle className="w-4 h-4" />
            Log This Meal
          </motion.button>
          {onDismiss && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onDismiss}
              className="btn-secondary px-4"
            >
              <XCircle className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

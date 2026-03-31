import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Lightbulb, Target, TrendingUp } from 'lucide-react'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { MiniMacro } from '@/components/ui/MacroBar'
import { getDecisionColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function DecisionCard({ meal, onAdd, onDismiss }) {
  const dc = getDecisionColor(meal.decisionScore ?? meal.score ?? 50)
  
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
      className={cn('rounded-2xl border-2 overflow-hidden shadow-card-hover', dc.border, dc.bg)}
    >
      {/* Decision Header */}
      <div className={cn('flex items-center justify-between px-5 py-4 border-b', dc.border)}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{dc.icon}</span>
          <div>
            <div className={cn('text-base font-display font-bold', dc.text)}>{dc.label}</div>
            <div className="text-xs text-surface-500 font-medium">{meal.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full',
            meal.goalAligned ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
          )}>
            {meal.goalAligned 
              ? <><CheckCircle className="w-3 h-3" /> Goal Aligned</>
              : <><XCircle className="w-3 h-3" /> Off Goal</>
            }
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Score + Macros row */}
        <div className="flex items-center gap-6">
          <CircularProgress 
            value={meal.decisionScore ?? meal.score ?? 50} 
            size={96} 
            strokeWidth={7}
            color={dc.ring}
            label="Score"
          />
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
              <span key={i} className="text-xs bg-white/70 border border-surface-200 text-surface-600 px-2 py-0.5 rounded-full font-medium">
                {item}
              </span>
            ))}
          </div>
        )}

        {/* AI Reason */}
        <motion.div 
          className="flex gap-3 p-3 bg-white/60 rounded-xl border border-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AlertCircle className="w-4 h-4 text-surface-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-surface-600 mb-0.5">AI Analysis</div>
            <div className="text-sm text-surface-700">{meal.reason}</div>
          </div>
        </motion.div>

        {/* Suggestion */}
        <motion.div 
          className="flex gap-3 p-3 bg-white/60 rounded-xl border border-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-surface-600 mb-0.5">Suggestion</div>
            <div className="text-sm text-surface-700">{meal.suggestion}</div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button onClick={onAdd} className="btn-primary flex-1 justify-center">
            <CheckCircle className="w-4 h-4" />
            Log This Meal
          </button>
          {onDismiss && (
            <button onClick={onDismiss} className="btn-secondary px-3">
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

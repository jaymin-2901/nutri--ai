import { motion } from 'framer-motion'
import { Trash2, Clock, TrendingUp } from 'lucide-react'
import { getDecisionColor, cn } from '@/lib/utils'
import { CircularProgress } from '@/components/ui/CircularProgress'

const MEAL_EMOJIS = {
  Breakfast: '🌅',
  Brunch: '☀️',
  Lunch: '🍽️',
  Snack: '🍎',
  Dinner: '🌙',
}

export function MealCard({ meal, onRemove, index = 0 }) {
  const dc = getDecisionColor(meal.score ?? meal.decisionScore ?? 50)
  const emoji = MEAL_EMOJIS[meal.mealType] || '🍴'
  const time = meal.timestamp
    ? new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(new Date(meal.timestamp))
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card rounded-2xl p-4 hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        {/* Emoji + score */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-surface-50 flex items-center justify-center text-2xl border border-surface-100">
            {emoji}
          </div>
          <div className={cn(
            'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white text-xs flex items-center justify-center font-bold',
            meal.score >= 70 ? 'bg-emerald-500 text-white' :
            meal.score >= 40 ? 'bg-amber-400 text-white' : 'bg-red-400 text-white'
          )}>
            {meal.score >= 70 ? '✓' : meal.score >= 40 ? '~' : '✗'}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-surface-800 truncate">{meal.name}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-surface-400">{meal.mealType}</span>
                {time && (
                  <>
                    <span className="text-surface-200">•</span>
                    <span className="text-xs text-surface-400 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />{time}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full border', dc.bg, dc.text, dc.border)}>
                {meal.score}
              </span>
              {onRemove && (
                <button
                  onClick={() => onRemove(meal.id)}
                  className="w-6 h-6 rounded-lg hover:bg-red-50 hover:text-red-500 text-surface-300 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Macros */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs font-semibold text-surface-700">{meal.calories} kcal</span>
            <div className="flex items-center gap-2 text-xs text-surface-400">
              <span className="text-blue-600 font-medium">P {meal.protein}g</span>
              <span className="text-amber-600 font-medium">C {meal.carbs}g</span>
              <span className="text-rose-500 font-medium">F {meal.fat}g</span>
            </div>
          </div>

          {/* Reason snippet */}
          {meal.reason && (
            <p className="text-xs text-surface-400 mt-1.5 leading-relaxed line-clamp-1 italic">
              "{meal.reason}"
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

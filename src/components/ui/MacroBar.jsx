import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function MacroBar({ label, value, max, unit = 'g', color = 'bg-brand-500', className }) {
  const pct = Math.min((value / max) * 100, 100)
  
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-surface-500">{label}</span>
        <span className="text-xs font-semibold text-surface-700 font-mono">
          {Math.round(value)}<span className="text-surface-400">/{max}{unit}</span>
        </span>
      </div>
      <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  )
}

export function MiniMacro({ label, value, unit, color }) {
  return (
    <div className="text-center">
      <div className={cn('text-lg font-bold font-display', color)}>{Math.round(value)}</div>
      <div className="text-xs text-surface-400">{unit}</div>
      <div className="text-xs text-surface-500 font-medium mt-0.5">{label}</div>
    </div>
  )
}

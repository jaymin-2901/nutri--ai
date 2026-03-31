import { cn } from '@/lib/utils'

const variants = {
  green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  yellow: 'bg-amber-100 text-amber-700 border-amber-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  gray: 'bg-surface-100 text-surface-600 border-surface-200',
  brand: 'bg-brand-100 text-brand-700 border-brand-200',
}

export function Badge({ children, variant = 'gray', className }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}

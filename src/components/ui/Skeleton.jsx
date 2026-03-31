import { cn } from '@/lib/utils'

export function Skeleton({ className }) {
  return <div className={cn('shimmer-bg rounded-xl', className)} />
}

export function CardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

export function MealSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4 flex gap-4 items-start">
      <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}

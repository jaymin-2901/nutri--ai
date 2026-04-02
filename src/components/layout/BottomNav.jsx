import { LayoutDashboard, Utensils, MessageSquare, User, MapPin } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const MOBILE_NAV = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
  { id: 'analyzer', icon: Utensils, label: 'Analyze' },
  { id: 'chat', icon: MessageSquare, label: 'Chat' },
  { id: 'finder', icon: MapPin, label: 'Find' },
  { id: 'profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-surface-100/80 px-2 pb-safe shadow-[0_-2px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around py-1.5">
        {MOBILE_NAV.map((item) => {
          const isActive = activeTab === item.id
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              whileTap={{ scale: 0.88 }}
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 relative min-w-[56px]"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-indicator"
                  className="absolute inset-0 bg-gradient-to-br from-brand-50 to-emerald-50 rounded-xl border border-brand-100/50"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className={cn(
                'w-5 h-5 relative z-10 transition-colors duration-200',
                isActive ? 'text-brand-600' : 'text-surface-400'
              )} />
              <span className={cn(
                'text-[10px] relative z-10 font-semibold transition-colors duration-200',
                isActive ? 'text-brand-600' : 'text-surface-400'
              )}>
                {item.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}

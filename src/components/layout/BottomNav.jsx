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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-surface-100 px-2 pb-safe">
      <div className="flex items-center justify-around py-1">
        {MOBILE_NAV.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-indicator"
                  className="absolute inset-0 bg-brand-50 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className={cn(
                'w-5 h-5 relative z-10 transition-colors duration-200',
                isActive ? 'text-brand-600' : 'text-surface-400'
              )} />
              <span className={cn(
                'text-xs relative z-10 font-medium transition-colors duration-200',
                isActive ? 'text-brand-600' : 'text-surface-400'
              )}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

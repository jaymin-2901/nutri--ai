import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Utensils, MessageSquare, User, 
  MapPin, Zap, Lightbulb, Flame, Settings
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'analyzer', icon: Utensils, label: 'Meal Analyzer' },
  { id: 'chat', icon: MessageSquare, label: 'AI Assistant' },
  { id: 'profile', icon: User, label: 'My Profile' },
  { id: 'finder', icon: MapPin, label: 'Food Finder' },
  { id: 'howai', icon: Lightbulb, label: 'How AI Works' },
]

export function Sidebar() {
  const { activeTab, setActiveTab, streak, profile } = useAppStore()

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="hidden lg:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-surface-100"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-surface-100">
        <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white text-sm shadow-glow-green">
          🥗
        </div>
        <div>
          <span className="font-display font-bold text-surface-900 text-base">NutriSense</span>
          <span className="block text-xs text-surface-400 -mt-0.5">AI Food Intelligence</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              'nav-item w-full',
              activeTab === item.id && 'nav-item-active'
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
            {item.id === 'analyzer' && (
              <span className="ml-auto w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse-slow" />
            )}
          </button>
        ))}
      </nav>

      {/* Streak badge */}
      {streak.count > 0 && (
        <motion.div 
          className="mx-3 mb-3 p-3 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2">
            <div className="text-xl">🔥</div>
            <div>
              <div className="text-sm font-bold text-orange-700">{streak.count} Day Streak!</div>
              <div className="text-xs text-orange-500">Best: {streak.longestStreak} days</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* User */}
      {profile.name && (
        <div className="p-4 border-t border-surface-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-sm font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-surface-800 truncate">{profile.name}</div>
              <div className="text-xs text-surface-400 capitalize">{profile.goal} weight</div>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  )
}

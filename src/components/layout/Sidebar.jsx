import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Utensils, MessageSquare, User, 
  MapPin, Zap, Lightbulb, Flame, Settings, Sparkles
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
      className="hidden lg:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-40 bg-white/95 backdrop-blur-xl border-r border-surface-100/80 shadow-[2px_0_20px_rgba(0,0,0,0.04)]"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-surface-100/60">
        <div className="relative">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center text-white shadow-glow-green">
            🥗
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-brand-500 rounded-full border-2 border-white" />
        </div>
        <div>
          <span className="font-display font-bold text-surface-900 text-base tracking-tight">NutriSense</span>
          <span className="block text-[10px] text-surface-400 -mt-0.5 font-medium tracking-wide uppercase">AI Food Intelligence</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'nav-item w-full',
              activeTab === item.id && 'nav-item-active'
            )}
          >
            <div className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200',
              activeTab === item.id
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-surface-100 text-surface-500 group-hover:bg-surface-200'
            )}>
              <item.icon className="w-3.5 h-3.5" />
            </div>
            <span className="flex-1 text-left">{item.label}</span>
            {item.id === 'analyzer' && (
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse-slow" />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Streak badge */}
      {streak.count > 0 && (
        <motion.div 
          className="mx-3 mb-3 p-3.5 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border border-orange-100/80 rounded-2xl shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-sm text-base">
              🔥
            </div>
            <div>
              <div className="text-sm font-bold text-orange-700">{streak.count} Day Streak!</div>
              <div className="text-xs text-orange-500/80">Best: {streak.longestStreak} days</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* User */}
      {profile.name && (
        <div className="p-4 border-t border-surface-100/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-surface-800 truncate">{profile.name}</div>
              <div className="text-xs text-surface-400 capitalize">{profile.goal} weight · AI active</div>
            </div>
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse-slow" />
          </div>
        </div>
      )}
    </motion.aside>
  )
}

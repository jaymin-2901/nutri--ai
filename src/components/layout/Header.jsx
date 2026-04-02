import { motion } from 'framer-motion'
import { Bell, Settings, Zap, Sparkles } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard', sub: 'Your daily nutrition overview' },
  analyzer: { title: 'Meal Analyzer', sub: 'AI-powered food intelligence' },
  chat: { title: 'AI Assistant', sub: 'Your personal nutrition coach' },
  profile: { title: 'My Profile', sub: 'Goals & preferences' },
  finder: { title: 'Food Finder', sub: 'Discover healthy options near you' },
  howai: { title: 'How AI Works', sub: 'Understanding your nutrition intelligence' },
}

export function Header({ onDemo }) {
  const { activeTab, profile } = useAppStore()
  const page = PAGE_TITLES[activeTab] || PAGE_TITLES.dashboard

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between px-5 lg:px-8 py-3.5 bg-white/80 backdrop-blur-xl border-b border-white/60 sticky top-0 z-30 shadow-[0_1px_12px_rgba(0,0,0,0.04)]"
    >
      {/* Mobile logo */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center text-white text-xs shadow-glow-green">
          🥗
        </div>
        <div>
          <span className="font-display font-bold text-surface-900 text-sm tracking-tight">NutriSense</span>
          <span className="block text-[9px] text-surface-400 -mt-0.5 font-medium tracking-wider uppercase">AI</span>
        </div>
      </div>

      {/* Desktop title */}
      <div className="hidden lg:block">
        <h1 className="text-lg font-display font-bold text-surface-900 tracking-tight">{page.title}</h1>
        <p className="text-xs text-surface-400">{page.sub}</p>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onDemo}
          className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white px-3.5 py-2 rounded-xl hover:shadow-glow-green transition-all duration-200 shadow-sm"
        >
          <Sparkles className="w-3 h-3" />
          Try Demo
        </motion.button>
      </div>
    </motion.header>
  )
}

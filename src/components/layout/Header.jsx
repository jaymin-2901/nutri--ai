import { motion } from 'framer-motion'
import { Bell, Settings, Zap, Key } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard', sub: 'Your daily nutrition overview' },
  analyzer: { title: 'Meal Analyzer', sub: 'AI-powered food intelligence' },
  chat: { title: 'AI Assistant', sub: 'Your personal nutrition coach' },
  profile: { title: 'My Profile', sub: 'Goals & preferences' },
  finder: { title: 'Food Finder', sub: 'Discover healthy options near you' },
  howai: { title: 'How AI Works', sub: 'Understanding your nutrition intelligence' },
}

export function Header({ onDemo, onOpenApiKey }) {
  const { activeTab, profile, apiKey } = useAppStore()
  const page = PAGE_TITLES[activeTab] || PAGE_TITLES.dashboard

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between px-5 lg:px-8 py-4 bg-white/80 backdrop-blur-xl border-b border-surface-100 sticky top-0 z-30"
    >
      {/* Mobile logo */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-white text-xs">
          🥗
        </div>
        <span className="font-display font-bold text-surface-900">NutriSense</span>
      </div>

      {/* Desktop title */}
      <div className="hidden lg:block">
        <h1 className="text-lg font-display font-bold text-surface-900">{page.title}</h1>
        <p className="text-xs text-surface-400">{page.sub}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onDemo}
          className="flex items-center gap-1.5 text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-100 transition-colors"
        >
          <Zap className="w-3 h-3" />
          Try Demo
        </button>
        <button
          onClick={onOpenApiKey}
          title={apiKey ? 'API key configured' : 'Set API key'}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
            apiKey
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
          }`}
        >
          <Key className="w-3 h-3" />
          <span className="hidden sm:inline">{apiKey ? 'API Key ✓' : 'Set API Key'}</span>
        </button>
      </div>
    </motion.header>
  )
}

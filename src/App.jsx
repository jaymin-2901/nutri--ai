import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { Header } from '@/components/layout/Header'
import { Dashboard } from '@/pages/Dashboard'
import { MealAnalyzer } from '@/pages/MealAnalyzer'
import { ChatAssistant } from '@/pages/ChatAssistant'
import { Profile } from '@/pages/Profile'
import { FoodFinder } from '@/pages/FoodFinder'
import { HowAIWorks } from '@/pages/HowAIWorks'
import { ApiKeyModal } from '@/components/features/ApiKeyModal'
import { useAppStore } from '@/store/useAppStore'

const PAGE_COMPONENTS = {
  dashboard: Dashboard,
  analyzer: MealAnalyzer,
  chat: ChatAssistant,
  profile: Profile,
  finder: FoodFinder,
  howai: HowAIWorks,
}

export default function App() {
  const { activeTab, loadDemo, apiKey } = useAppStore()
  const [apiKeyOpen, setApiKeyOpen] = useState(false)

  // Auto-open API key modal if no key is configured
  useEffect(() => {
    if (!apiKey) {
      const timer = setTimeout(() => setApiKeyOpen(true), 800)
      return () => clearTimeout(timer)
    }
  }, [apiKey])

  const PageComponent = PAGE_COMPONENTS[activeTab] || Dashboard

  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />

      {/* Main content area */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <Header onDemo={loadDemo} onOpenApiKey={() => setApiKeyOpen(true)} />

        <main className="flex-1 px-4 lg:px-8 py-5 pb-24 lg:pb-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <PageComponent
                onOpenApiKey={() => setApiKeyOpen(true)}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <BottomNav />
      <ApiKeyModal isOpen={apiKeyOpen} onClose={() => setApiKeyOpen(false)} />
    </div>
  )
}

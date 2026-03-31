import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Key, ExternalLink, Eye, EyeOff, CheckCircle, X } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export function ApiKeyModal({ isOpen, onClose }) {
  const { apiKey, setApiKey } = useAppStore()
  const [value, setValue] = useState(apiKey)
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setApiKey(value.trim())
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose() }, 1200)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative bg-white rounded-2xl shadow-xl border border-surface-200 w-full max-w-md p-6"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-surface-400 hover:text-surface-600">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                <Key className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h2 className="font-display font-bold text-surface-900">Gemini API Key</h2>
                <p className="text-xs text-surface-400">Required for AI features</p>
              </div>
            </div>

<div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-emerald-700">API Key Pre-configured</span>
                </div>
                <p className="text-emerald-600">Gemini AI is ready! No key needed.</p>
              </div>

              <div className="p-3 bg-surface-50 rounded-xl text-xs text-surface-500 space-y-1">
                <p className="font-medium text-surface-600">How to get a free key:</p>
                <p>1. Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-brand-600 underline">Google AI Studio</a></p>
                <p>2. Sign in with Google → Create API Key</p>
                <p>3. Copy and paste it above</p>
                <p className="text-surface-400 mt-2">🔒 Key is stored locally in your browser only</p>
              </div>

              <button
                onClick={handleSave}
                disabled={!value.trim()}
                className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : 'Save API Key'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

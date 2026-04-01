import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X, Key, ExternalLink, ChevronRight } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const PROVIDERS = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    model: 'gemini-1.5-flash',
    badge: 'Free Tier',
    badgeColor: 'blue',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    description: 'Free tier from Google AI Studio. Supports text & image analysis.',
    keyPlaceholder: 'AIza...',
  },
  {
    id: 'groq',
    name: 'Groq (LLaMA)',
    model: 'llama-3.3-70b + vision',
    badge: 'Completely Free',
    badgeColor: 'green',
    keyUrl: 'https://console.groq.com/keys',
    description: 'Completely free – 14,400 requests/day. Powered by LLaMA models.',
    keyPlaceholder: 'gsk_...',
  },
]

export function ApiKeyModal({ isOpen, onClose }) {
  const { apiKey, setApiKey, aiProvider, setAiProvider } = useAppStore()
  const [selectedProvider, setSelectedProvider] = useState(aiProvider || 'gemini')
  const [keyInput, setKeyInput] = useState(apiKey || '')
  const [saved, setSaved] = useState(false)

  const provider = PROVIDERS.find(p => p.id === selectedProvider)

  const handleSave = () => {
    const trimmed = keyInput.trim()
    if (!trimmed) return
    setApiKey(trimmed)
    setAiProvider(selectedProvider)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1000)
  }

  const handleProviderSwitch = (id) => {
    setSelectedProvider(id)
    setKeyInput('')
    setSaved(false)
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
            className="relative bg-white rounded-2xl shadow-xl border border-surface-200 w-full max-w-md p-6 max-h-[90vh] overflow-auto"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-surface-400 hover:text-surface-600">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                <Key className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h2 className="font-display font-bold text-surface-900">AI Provider Setup</h2>
                <p className="text-xs text-surface-400">Choose a free AI provider and enter your key</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Provider selector */}
              <div>
                <p className="text-xs font-semibold text-surface-600 mb-2">Choose Provider</p>
                <div className="grid grid-cols-2 gap-2">
                  {PROVIDERS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleProviderSwitch(p.id)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        selectedProvider === p.id
                          ? 'border-brand-400 bg-brand-50'
                          : 'border-surface-200 hover:border-surface-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-surface-800 leading-tight">{p.name}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                          p.badgeColor === 'green'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-surface-500">{p.model}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider description */}
              <div className="p-3 bg-surface-50 rounded-xl text-xs text-surface-600">
                {provider.description}
              </div>

              {/* API key input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-surface-600">{provider.name} API Key</p>
                  <a
                    href={provider.keyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-0.5 text-[11px] text-brand-600 hover:underline"
                  >
                    Get free key <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="password"
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  placeholder={provider.keyPlaceholder}
                  className="input-field text-sm font-mono"
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                />
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={!keyInput.trim()}
                className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saved ? (
                  <><CheckCircle className="w-4 h-4" /> Saved!</>
                ) : (
                  <><ChevronRight className="w-4 h-4" /> Save & Activate</>
                )}
              </button>

              {/* Current status */}
              {apiKey && (
                <p className="text-center text-[11px] text-surface-400">
                  Currently using: <span className="font-semibold text-surface-600">
                    {PROVIDERS.find(p => p.id === aiProvider)?.name || 'Gemini'}
                  </span>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X, Key, ExternalLink, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export function ApiKeyModal({ isOpen, onClose }) {
  const { apiKey, setApiKey } = useAppStore()
  const [input, setInput] = useState(apiKey || '')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = () => {
    const trimmed = input.trim()
    if (!trimmed) {
      setError('Please enter a valid API key.')
      return
    }
    if (!trimmed.startsWith('AIza') && trimmed.length < 20) {
      setError('This does not look like a valid API key. Please check and try again.')
      return
    }
    setApiKey(trimmed)
    setSaved(true)
    setError('')
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1200)
  }

  const handleClose = () => {
    setInput(apiKey || '')
    setError('')
    setSaved(false)
    onClose()
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
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative bg-white rounded-2xl shadow-xl border border-surface-200 w-full max-w-md p-6 max-h-[90vh] overflow-auto"
          >
            <button onClick={handleClose} className="absolute top-4 right-4 text-surface-400 hover:text-surface-600">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                <Key className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h2 className="font-display font-bold text-surface-900">Gemini API Key</h2>
                <p className="text-xs text-surface-400">Required for AI meal analysis & chat</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Status */}
              {apiKey ? (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-emerald-700 font-medium">API key active — AI features enabled</span>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-amber-700">No API key set. Enter your Gemini API key below to enable AI features.</span>
                </div>
              )}

              {/* Key input */}
              <div>
                <label className="text-xs font-semibold text-surface-600 mb-1.5 block">
                  Your Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={input}
                    onChange={e => { setInput(e.target.value); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                    placeholder="AIza..."
                    className="input-field pr-10 font-mono text-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>

              {/* How to get */}
              <div className="p-3 bg-surface-50 rounded-xl text-xs text-surface-500 space-y-1.5">
                <p className="font-semibold text-surface-600">How to get a free API key:</p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">aistudio.google.com/app/apikey</a></li>
                  <li>Sign in with your Google account</li>
                  <li>Click <strong>Create API key</strong></li>
                  <li>Copy and paste it above</li>
                </ol>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand-600 font-medium mt-2 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" /> Open Google AI Studio
                </a>
              </div>

              <div className="text-xs text-surface-400 bg-surface-50 p-3 rounded-xl">
                🔒 Your API key is stored only in your browser's local storage and is sent only to Google's Gemini API endpoints when making AI requests.
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={!input.trim()}
                  className="btn-primary flex-1 justify-center disabled:opacity-40"
                >
                  {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Key className="w-4 h-4" /> Save API Key</>}
                </button>
                <button onClick={handleClose} className="btn-secondary px-4">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

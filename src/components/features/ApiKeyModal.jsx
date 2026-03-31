import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export function ApiKeyModal({ isOpen, onClose }) {
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
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-display font-bold text-surface-900">Gemini API Ready</h2>
                <p className="text-xs text-surface-400">Pre-configured for all users</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-emerald-700">✅ API Key Active</span>
                </div>
                <p className="text-emerald-600">AI analysis works instantly – no setup required!</p>
              </div>

              <div className="text-xs text-surface-500 space-y-2 p-3 bg-surface-50 rounded-xl">
                <p className="font-medium text-surface-600 mb-1">Key Management:</p>
                <ul className="space-y-1 text-[11px]">
                  <li>• DevTools → Application → Local Storage → nutrisense-storage → Edit 'apiKey'</li>
                  <li>• Or clear site data to reset</li>
                </ul>
              </div>

              <button
                onClick={onClose}
                className="btn-primary w-full"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

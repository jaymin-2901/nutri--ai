import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Trash2, Bot, User, Key, Sparkles } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { chatWithNutritionAI } from '@/lib/gemini'

const STARTER_PROMPTS = [
  'What should I eat for breakfast with a fat loss goal?',
  'How much protein do I need daily?',
  'Is paneer good for weight loss?',
  'Best post-workout meal suggestions?',
  'How can I reduce carb cravings?',
  'Healthy snack ideas under 200 calories?',
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1 px-1">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  )
}

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${
        isUser
          ? 'bg-gradient-to-br from-brand-400 to-brand-600 text-white'
          : 'bg-white border border-surface-100 text-surface-600 shadow-sm'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-tr-sm'
            : 'bg-white border border-surface-100 text-surface-700 rounded-tl-sm'
        }`}>
          {msg.content}
        </div>
        <span className="text-[10px] text-surface-300 px-1">
          {msg.timestamp
            ? new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(new Date(msg.timestamp))
            : ''}
        </span>
      </div>
    </motion.div>
  )
}

export function ChatAssistant({ onOpenApiKey }) {
  const { chatMessages, addChatMessage, clearChat, profile, apiKey } = useAppStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()
  const inputRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, loading])

  const send = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    if (!apiKey) { onOpenApiKey(); return }

    setInput('')
    addChatMessage({ role: 'user', content: msg })
    setLoading(true)

    try {
      const allMsgs = [...chatMessages, { role: 'user', content: msg }]
      const reply = await chatWithNutritionAI(allMsgs, profile, apiKey)
      addChatMessage({ role: 'assistant', content: reply })
    } catch (err) {
      addChatMessage({
        role: 'assistant',
        content: `Sorry, I ran into an issue: ${err.message}. Please check your API key.`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] max-w-2xl mx-auto">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-white border border-surface-100/80 rounded-t-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-sm">
            <Bot className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="text-sm font-display font-bold text-surface-800">NutriSense AI</div>
            <div className="text-xs text-brand-500 flex items-center gap-1.5 font-medium" aria-live="polite">
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse-slow inline-block" aria-hidden="true" />
              {loading ? 'Typing...' : 'Online · Ready to help'}
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={clearChat}
          className="w-8 h-8 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-500 flex items-center justify-center transition-colors border border-transparent hover:border-red-100"
          title="Clear chat"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: 'rgb(241, 251, 253)' }}>
        {chatMessages.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-green"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="font-display font-bold text-surface-700 mb-1.5">Ask NutriSense AI</h3>
            <p className="text-sm text-surface-400 mb-5 max-w-xs mx-auto leading-relaxed">
              {profile.name
                ? `Hi ${profile.name}! I'm personalized to your ${profile.goal} weight goal.`
                : 'Get personalized nutrition advice powered by Gemini AI.'}
            </p>
            <div className="space-y-2 text-left max-w-xs mx-auto">
              {STARTER_PROMPTS.map((p, i) => (
                <motion.button
                  key={p}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 3, scale: 1.01 }}
                  onClick={() => send(p)}
                  className="w-full text-left text-xs text-surface-600 bg-white border border-surface-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 px-3.5 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  {p}
                </motion.button>
              ))}
            </div>
            {!apiKey && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={onOpenApiKey}
                className="mt-5 flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg mx-auto hover:bg-amber-100 transition-colors"
              >
                <Key className="w-3 h-3" /> Set API key to start chatting
              </motion.button>
            )}
          </motion.div>
        ) : (
          <>
            {chatMessages.map(msg => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-surface-100 flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4 text-surface-500" />
                </div>
                <div className="bg-white border border-surface-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3.5 bg-white border border-surface-100/80 rounded-b-2xl shadow-sm">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask about nutrition, meals, macros..."
            className="input-field py-2.5 text-sm"
            disabled={loading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="btn-primary px-3.5 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </motion.button>
        </div>
        <p className="text-[10px] text-surface-300 mt-1.5 text-center tracking-wide">
          Context-aware · Personalized to your {profile.goal || 'health'} goal
        </p>
      </div>
    </div>
  )
}

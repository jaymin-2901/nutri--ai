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
    <div className="flex items-center gap-1 py-1">
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
        isUser ? 'bg-brand-100 text-brand-700' : 'bg-surface-100 text-surface-600'
      }`}>
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-brand-600 text-white rounded-tr-sm'
            : 'bg-white border border-surface-100 text-surface-700 shadow-sm rounded-tl-sm'
        }`}>
          {msg.content}
        </div>
        <span className="text-xs text-surface-300 px-1">
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
      <div className="flex items-center justify-between px-4 py-3 glass-card rounded-t-2xl border-b border-surface-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-50 rounded-xl flex items-center justify-center">
            <Bot className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <div className="text-sm font-display font-bold text-surface-800">NutriSense AI</div>
            <div className="text-xs text-brand-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse-slow inline-block" />
              {loading ? 'Typing...' : 'Online'}
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="w-7 h-7 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 flex items-center justify-center transition-colors"
          title="Clear chat"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-surface-50 space-y-3">
        {chatMessages.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-7 h-7 text-brand-500" />
            </div>
            <h3 className="font-display font-bold text-surface-700 mb-1">Ask NutriSense AI</h3>
            <p className="text-sm text-surface-400 mb-5">
              {profile.name
                ? `Hi ${profile.name}! I'm personalized to your ${profile.goal} weight goal.`
                : 'Get personalized nutrition advice powered by Gemini AI.'}
            </p>
            <div className="space-y-2 text-left max-w-xs mx-auto">
              {STARTER_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="w-full text-left text-xs text-surface-600 bg-white border border-surface-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 px-3 py-2.5 rounded-xl transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
            {!apiKey && (
              <button
                onClick={onOpenApiKey}
                className="mt-5 flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg mx-auto hover:bg-amber-100"
              >
                <Key className="w-3 h-3" /> Set API key to start chatting
              </button>
            )}
          </motion.div>
        ) : (
          <>
            {chatMessages.map(msg => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-surface-100 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-surface-500" />
                </div>
                <div className="bg-white border border-surface-100 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-surface-100 rounded-b-2xl">
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
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="btn-primary px-3 disabled:opacity-40 flex-shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-surface-300 mt-1.5 text-center">
          Context-aware · Personalized to your {profile.goal || 'health'} goal
        </p>
      </div>
    </div>
  )
}

// src/pages/ChatPage.tsx
// ─────────────────────────────────────
// صفحه چت با MODO — Glass + Quick Replies + Sound
// ─────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { Trash2, Sparkles } from 'lucide-react'
import ChatBubble from '../components/chat/ChatBubble'
import ChatInput from '../components/chat/ChatInput'
import TypingIndicator from '../components/chat/TypingIndicator'
import {
  saveChatMessage,
  getChatHistory,
  clearChatHistory,
  getUserProfile,
  earnBadge,
  checkAndAwardBadges,
  calculateStreak,
  getTodayTaskStats,
  getGoalsByStatus,
  getCompletedGoalsCount,
} from '../utils/dbHelpers'
import { sendMessageToAI } from '../utils/api'
import type { ChatContext } from '../utils/api'
import { WELCOME_MESSAGE } from '../utils/mockResponses'
import { playMessageSent, playMessageReceived } from '../utils/sounds'
import type { ChatMessage, UserProfile } from '../utils/db'

const QUICK_REPLIES = [
  'امروز چیکار کنم؟',
  'انگیزه ندارم',
  'چطوری تمرکز کنم؟',
  'یه نصیحت بده',
  'خسته‌ام',
  'برنامه فردا',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>()
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // ─── لود چت ───
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    async function loadChat() {
      try {
        const profile = await getUserProfile()
        setUserProfile(profile)
        const history = await getChatHistory()

        if (history.length === 0) {
          const welcomeText = profile
            ? `سلام ${profile.name}! من MODO هستم، کوچ شخصیت.\n\nاینجام که کمکت کنم به زندگیت نظم بدی، اهدافت رو مشخص کنی و هر روز یه قدم جلوتر بری.\n\nاز پروفایلت میبینم که دنبال تغییر هستی.\n\nاز چی میخوای شروع کنیم؟`
            : WELCOME_MESSAGE
          await saveChatMessage('assistant', welcomeText)
          const updated = await getChatHistory()
          setMessages(updated)
        } else {
          setMessages(history)
        }
      } catch (err) {
        console.error('خطا در بارگذاری چت:', err)
      } finally {
        setLoading(false)
      }
    }
    loadChat()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // ─── Context ───
  async function gatherContext(): Promise<ChatContext> {
    try {
      const streak = await calculateStreak()
      const taskStats = await getTodayTaskStats()
      const activeGoals = await getGoalsByStatus('active')
      const completedGoals = await getCompletedGoalsCount()
      return {
        streak,
        todayTasksCompleted: taskStats.completed,
        todayTasksTotal: taskStats.total,
        activeGoalsCount: activeGoals.length,
        completedGoalsCount: completedGoals,
      }
    } catch {
      return { streak: 0, todayTasksCompleted: 0, todayTasksTotal: 0, activeGoalsCount: 0, completedGoalsCount: 0 }
    }
  }

  // ─── ارسال پیام ───
  const handleSendMessage = async (text: string) => {
    setError(null)
    await saveChatMessage('user', text)
    const userMessage: ChatMessage = { role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    playMessageSent()
    await earnBadge('first_chat')
    setIsTyping(true)

    try {
      const context = await gatherContext()
      const response = await sendMessageToAI(text, messages, userProfile, context)
      await saveChatMessage('assistant', response)
      const assistantMessage: ChatMessage = { role: 'assistant', content: response, timestamp: new Date() }
      setIsTyping(false)
      setMessages(prev => [...prev, assistantMessage])
      playMessageReceived()
      await checkAndAwardBadges()
    } catch (err) {
      setIsTyping(false)
      const errorMessage = err instanceof Error ? err.message : 'مشکلی پیش اومد'
      setError(errorMessage)
      const errorReply = `متاسفم، مشکلی پیش اومد.\n\n${errorMessage}\n\nدوباره تلاش کن.`
      await saveChatMessage('assistant', errorReply)
      setMessages(prev => [...prev, { role: 'assistant', content: errorReply, timestamp: new Date() }])
    }
  }

  // ─── پاک کردن ───
  const handleClearChat = async () => {
    if (!window.confirm('مطمئنی میخوای تاریخچه چت رو پاک کنی؟')) return
    await clearChatHistory()
    const profile = await getUserProfile()
    const welcomeText = profile
      ? `سلام ${profile.name}! چت پاک شد. از نو شروع کنیم!\n\nدرباره چی میخوای حرف بزنیم؟`
      : WELCOME_MESSAGE
    await saveChatMessage('assistant', welcomeText)
    const updated = await getChatHistory()
    setMessages(updated)
    setError(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div
          className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-accent)' }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">

      {/* ═══ هدر شیشه‌ای ═══ */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b modo-glass"
        style={{
          backgroundColor: 'var(--color-nav-bg)',
          borderColor: 'var(--color-glass-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm animate-breathe"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-gradient-start), var(--color-accent-gradient-end))',
              color: '#FFFFFF',
              boxShadow: '0 2px 12px var(--color-shadow-accent)',
            }}
          >
            M
          </div>
          <div>
            <h2 className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
              MODO
            </h2>
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full animate-gentle-pulse"
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
              <p className="text-[10px]" style={{ color: 'var(--color-accent)' }}>
                آنلاین
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2.5 rounded-xl transition-all active:scale-90"
          style={{
            color: 'var(--color-text-secondary)',
            backgroundColor: 'var(--color-bg-tertiary)',
          }}
          title="پاک کردن چت"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* ═══ نوار خطا ═══ */}
      {error && (
        <div
          className="mx-4 mt-2 px-4 py-2 rounded-xl text-sm animate-slide-down"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--color-danger)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          {error}
        </div>
      )}

      {/* ═══ پیام‌ها ═══ */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ paddingBottom: '100px' }}>
        <div className="text-center mb-6">
          <span
            className="text-[10px] px-3 py-1 rounded-full"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {new Date().toLocaleDateString('fa-IR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            role={msg.role}
            content={msg.content}
            timestamp={new Date(msg.timestamp)}
          />
        ))}

        {isTyping && <TypingIndicator />}

        {/* ═══ Quick Replies ═══ */}
        {!isTyping && messages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto py-3 px-1">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSendMessage(reply)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all active:scale-95"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  color: 'var(--color-accent)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <Sparkles size={12} />
                {reply}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ═══ ورودی ═══ */}
      <ChatInput onSend={handleSendMessage} disabled={isTyping} />
    </div>
  )
}
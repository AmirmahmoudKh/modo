// src/pages/ChatPage.tsx
// ─────────────────────────────────────
// صفحه چت با MODO
// ─────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { Trash2, ArrowRight } from 'lucide-react'
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
import type { ChatMessage, UserProfile } from '../utils/db'

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
            ? `سلام ${profile.name}! من MODO هستم، کوچ شخصیت.\n\nاینجام که کمکت کنم به زندگیت نظم بدی، اهدافت رو مشخص کنی و هر روز یه قدم جلوتر بری.\n\nاز پروفایلت میبینم که دنبال تغییر هستی. عالیه!\n\nاز چی میخوای شروع کنیم؟`
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

  // ─── جمع‌آوری Context ───
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
      return {
        streak: 0,
        todayTasksCompleted: 0,
        todayTasksTotal: 0,
        activeGoalsCount: 0,
        completedGoalsCount: 0,
      }
    }
  }

  // ─── ارسال پیام ───
  const handleSendMessage = async (text: string) => {
    setError(null)

    await saveChatMessage('user', text)
    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    await earnBadge('first_chat')
    setIsTyping(true)

    try {
      // جمع‌آوری context واقعی
      const context = await gatherContext()

      const response = await sendMessageToAI(
        text,
        messages,
        userProfile,
        context
      )

      await saveChatMessage('assistant', response)
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setIsTyping(false)
      setMessages(prev => [...prev, assistantMessage])
      await checkAndAwardBadges()

    } catch (err) {
      setIsTyping(false)
      const errorMessage = err instanceof Error ? err.message : 'مشکلی پیش اومد'
      setError(errorMessage)

      const errorReply = `متاسفم، مشکلی پیش اومد.\n\n${errorMessage}\n\nدوباره تلاش کن.`
      await saveChatMessage('assistant', errorReply)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorReply,
        timestamp: new Date(),
      }])
    }
  }

  // ─── پاک کردن چت ───
  const handleClearChat = async () => {
    const confirmed = window.confirm('مطمئنی میخوای تاریخچه چت رو پاک کنی؟')
    if (!confirmed) return

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
          style={{
            borderColor: 'var(--color-border)',
            borderTopColor: 'var(--color-accent)',
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">

      {/* هدر */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: '#FFFFFF',
            }}
          >
            M
          </div>
          <div>
            <h2
              className="font-bold text-sm"
              style={{ color: 'var(--color-text-primary)' }}
            >
              MODO
            </h2>
            <p
              className="text-[10px]"
              style={{ color: 'var(--color-success)' }}
            >
              آنلاین
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 rounded-xl transition-all active:scale-90"
          style={{ color: 'var(--color-text-secondary)' }}
          title="پاک کردن چت"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* نوار خطا */}
      {error && (
        <div
          className="mx-4 mt-2 px-4 py-2 rounded-xl text-sm"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--color-danger)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          {error}
        </div>
      )}

      {/* پیام‌ها */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ paddingBottom: '80px' }}
      >
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
        <div ref={messagesEndRef} />
      </div>

      {/* ورودی */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isTyping}
      />
    </div>
  )
}
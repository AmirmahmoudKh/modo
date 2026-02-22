// src/pages/ChatPage.tsx
// ─────────────────────────────────────
// صفحه چت با MODO - حالا با AI واقعی!
// ─────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { Trash2 } from 'lucide-react'
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
} from '../utils/dbHelpers'
import { sendMessageToAI } from '../utils/api'
import { WELCOME_MESSAGE } from '../utils/mockResponses'
import type { ChatMessage, UserProfile } from '../utils/db'

export default function ChatPage() {
  // ─── State ها ───
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>()
  const [error, setError] = useState<string | null>(null)

  // رفرنس‌ها
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  // ─── اسکرول به پایین ───
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // ─── لود تاریخچه چت + پروفایل ───
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    async function loadChat() {
      try {
        // پروفایل رو بخون (برای شخصی‌سازی AI)
        const profile = await getUserProfile()
        setUserProfile(profile)

        // تاریخچه چت
        const history = await getChatHistory()

        if (history.length === 0) {
          // پیام خوش‌آمدگویی شخصی‌سازی شده
          const welcomeText = profile
            ? `سلام ${profile.name}! 👋 من MODO هستم، کوچ شخصیت.\n\nاینجام که کمکت کنم به زندگیت نظم بدی، اهدافت رو مشخص کنی و هر روز یه قدم جلوتر بری.\n\nاز پروفایلت میبینم که ${profile.goals.length > 0 ? 'دنبال تغییر هستی' : 'تازه شروع کردی'}. عالیه!\n\nاز چی میخوای شروع کنیم؟ 🚀`
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

  // ─── اسکرول وقتی پیام جدید میاد ───
  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // ─── ارسال پیام ───
  const handleSendMessage = async (text: string) => {
    // پاک کردن خطای قبلی
    setError(null)

    // ۱. ذخیره و نمایش پیام کاربر
    await saveChatMessage('user', text)
    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    // ۲. نشان "اولین گفتگو"
    await earnBadge('first_chat')

    // ۳. نشون بده داره تایپ میکنه
    setIsTyping(true)

    try {
      // ۴. ارسال به AI (واقعی یا ساختگی)
      const response = await sendMessageToAI(text, messages, userProfile)

      // ۵. ذخیره و نمایش پاسخ
      await saveChatMessage('assistant', response)
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setIsTyping(false)
      setMessages(prev => [...prev, assistantMessage])

      // ۶. چک نشان‌ها
      await checkAndAwardBadges()

    } catch (err) {
      setIsTyping(false)
      const errorMessage = err instanceof Error ? err.message : 'مشکلی پیش اومد'
      setError(errorMessage)

      // ذخیره پیام خطا بعنوان پاسخ MODO
      const errorReply = `متأسفم، مشکلی پیش اومد 😔\n\n${errorMessage}\n\nدوباره تلاش کن.`
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
      ? `سلام ${profile.name}! 👋 چت پاک شد. از نو شروع کنیم!\n\nدرباره چی میخوای حرف بزنیم؟ 🚀`
      : WELCOME_MESSAGE

    await saveChatMessage('assistant', welcomeText)
    const updated = await getChatHistory()
    setMessages(updated)
    setError(null)
  }

  // ─── لودینگ ───
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

  // ─── رندر صفحه ───
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">

      {/* ─── هدر ─── */}
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
              ● آنلاین
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

      {/* ─── نوار خطا ─── */}
      {error && (
        <div
          className="mx-4 mt-2 px-4 py-2 rounded-xl text-sm"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--color-danger)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* ─── لیست پیام‌ها ─── */}
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

      {/* ─── ورودی پیام ─── */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isTyping}
      />
    </div>
  )
}
// src/components/chat/ChatBubble.tsx
// ─────────────────────────────────────
// حباب پیام چت
// کاربر: سمت چپ، رنگ accent
// MODO: سمت راست، رنگ خاکستری
// (چون RTL هستیم، چپ و راست برعکس LTR هست)
// ─────────────────────────────────────

interface ChatBubbleProps {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
  const isUser = role === 'user'

  // فرمت ساعت: "۱۴:۳۲"
  const timeStr = timestamp.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`flex ${isUser ? 'justify-start' : 'justify-end'} mb-3`}
    >
      <div className="max-w-[80%]">
        {/* حباب */}
        <div
          className="rounded-2xl px-4 py-3"
          style={{
            backgroundColor: isUser
              ? 'var(--color-accent)'
              : 'var(--color-bg-secondary)',
            border: isUser
              ? 'none'
              : '1px solid var(--color-border)',
            // گوشه‌های حباب
            borderTopRightRadius: isUser ? '1rem' : '0.25rem',
            borderTopLeftRadius: isUser ? '0.25rem' : '1rem',
          }}
        >
          {/* اسم فرستنده */}
          <p
            className="text-[10px] font-bold mb-1"
            style={{
              color: isUser
                ? 'rgba(255,255,255,0.7)'
                : 'var(--color-accent)',
            }}
          >
            {isUser ? 'تو' : 'MODO'}
          </p>

          {/* متن پیام */}
          <p
            className="text-sm leading-7 whitespace-pre-wrap"
            style={{
              color: isUser
                ? '#FFFFFF'
                : 'var(--color-text-primary)',
            }}
          >
            {content}
          </p>
        </div>

        {/* ساعت */}
        <p
          className={`text-[10px] mt-1 px-1 ${isUser ? 'text-left' : 'text-right'}`}
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {timeStr}
        </p>
      </div>
    </div>
  )
}
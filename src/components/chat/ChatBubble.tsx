// src/components/chat/ChatBubble.tsx
// ─────────────────────────────────────
// بابل پیام — طراحی مدرن
// ─────────────────────────────────────

interface ChatBubbleProps {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
  const isUser = role === 'user'

  const timeStr = timestamp.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`flex ${isUser ? 'justify-start' : 'justify-end'} mb-4 chat-bubble-enter`}
    >
      {/* آواتار MODO (فقط برای assistant) */}
      {!isUser && (
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] ml-2 mt-1"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-gradient-start), var(--color-accent-gradient-end))',
            color: '#FFFFFF',
          }}
        >
          M
        </div>
      )}

      <div className="max-w-[78%]">
        <div
          className="px-4 py-3"
          style={{
            background: isUser
              ? 'linear-gradient(135deg, var(--color-accent-gradient-start), var(--color-accent-gradient-end))'
              : 'var(--color-bg-secondary)',
            border: isUser ? 'none' : '1px solid var(--color-border)',
            borderRadius: isUser
              ? '20px 4px 20px 20px'
              : '4px 20px 20px 20px',
            boxShadow: isUser
              ? '0 2px 12px var(--color-shadow-accent)'
              : '0 1px 4px var(--color-shadow)',
          }}
        >
          <p
            className="text-sm leading-7 whitespace-pre-wrap"
            style={{
              color: isUser ? '#FFFFFF' : 'var(--color-text-primary)',
            }}
          >
            {content}
          </p>
        </div>

        {/* زمان */}
        <p
          className={`text-[10px] mt-1 px-2 ${isUser ? 'text-left' : 'text-right'}`}
          style={{ color: 'var(--color-text-secondary)', opacity: 0.7 }}
        >
          {timeStr}
        </p>
      </div>
    </div>
  )
}
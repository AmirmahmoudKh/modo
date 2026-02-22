// src/components/chat/ChatBubble.tsx

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
      className={`flex ${isUser ? 'justify-start' : 'justify-end'} mb-3 chat-bubble-enter`}
    >
      <div className="max-w-[80%]">
        <div
          className="rounded-2xl px-4 py-3 transition-all"
          style={{
            background: isUser
              ? 'linear-gradient(135deg, var(--color-accent-gradient-start), var(--color-accent-gradient-end))'
              : 'var(--color-bg-secondary)',
            border: isUser
              ? 'none'
              : '1px solid var(--color-border)',
            borderTopRightRadius: isUser ? '1rem' : '0.25rem',
            borderTopLeftRadius: isUser ? '0.25rem' : '1rem',
            boxShadow: isUser
              ? '0 2px 12px var(--color-shadow-accent)'
              : '0 1px 4px var(--color-shadow)',
          }}
        >
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
// src/components/chat/ChatInput.tsx
// ─────────────────────────────────────
// فیلد ورودی پیام + دکمه ارسال
// ─────────────────────────────────────

import { useState, useRef } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void  // تابعی که پیام رو ارسال میکنه
  disabled?: boolean                  // وقتی MODO داره جواب میده، غیرفعال بشه
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ارسال پیام
  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return

    onSend(trimmed)
    setText('')

    // ارتفاع textarea رو ریست کن
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  // وقتی Enter زده بشه → ارسال (Shift+Enter → خط جدید)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ارتفاع textarea خودکار زیاد بشه
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    // ارتفاع رو خودکار تنظیم کن
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  const hasText = text.trim().length > 0

  return (
    <div
      className="fixed bottom-16 left-0 right-0 p-3 border-t"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div
        className="flex items-end gap-2 rounded-2xl p-2"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* فیلد متنی */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="پیامت رو بنویس..."
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent outline-none resize-none text-sm py-2 px-3 max-h-[120px]"
          style={{
            color: 'var(--color-text-primary)',
            direction: 'rtl',
          }}
        />

        {/* دکمه ارسال */}
        <button
          onClick={handleSend}
          disabled={!hasText || disabled}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 active:scale-90"
          style={{
            backgroundColor: hasText && !disabled
              ? 'var(--color-accent)'
              : 'var(--color-bg-tertiary)',
            transform: hasText ? 'scale(1)' : 'scale(0.9)',
          }}
        >
          <Send
            size={18}
            style={{
              color: hasText && !disabled
                ? '#FFFFFF'
                : 'var(--color-text-secondary)',
              // آیکون رو بچرخون برای RTL
              transform: 'scaleX(-1)',
            }}
          />
        </button>
      </div>
    </div>
  )
}
// src/components/chat/ChatInput.tsx
// ─────────────────────────────────────
// ورودی پیام — Glass effect
// ─────────────────────────────────────

import { useState, useRef } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  const hasText = text.trim().length > 0

  return (
    <div
      className="fixed bottom-16 left-0 right-0 p-3 border-t modo-glass"
      style={{
        backgroundColor: 'var(--color-nav-bg)',
        borderColor: 'var(--color-glass-border)',
      }}
    >
      <div
        className="flex items-end gap-2 rounded-2xl p-2"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 2px 8px var(--color-shadow)',
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
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 active:scale-90"
          style={{
            background: hasText && !disabled
              ? 'linear-gradient(135deg, var(--color-accent-gradient-start), var(--color-accent-gradient-end))'
              : 'var(--color-bg-tertiary)',
            transform: hasText ? 'scale(1)' : 'scale(0.9)',
            boxShadow: hasText && !disabled ? '0 2px 8px var(--color-shadow-accent)' : 'none',
          }}
        >
          <Send
            size={18}
            style={{
              color: hasText && !disabled ? '#FFFFFF' : 'var(--color-text-secondary)',
              transform: 'scaleX(-1)',
              transition: 'color 0.3s ease',
            }}
          />
        </button>
      </div>
    </div>
  )
}
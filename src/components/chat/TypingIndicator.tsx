// src/components/chat/TypingIndicator.tsx
// ─────────────────────────────────────
// سه نقطه متحرک که نشون میده MODO داره تایپ میکنه
// ─────────────────────────────────────

export default function TypingIndicator() {
  return (
    <div className="flex justify-end mb-3">
      <div
        className="rounded-2xl px-5 py-4"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderTopLeftRadius: '0.25rem',
        }}
      >
        {/* اسم */}
        <p
          className="text-[10px] font-bold mb-2"
          style={{ color: 'var(--color-accent)' }}
        >
          MODO
        </p>

        {/* سه نقطه متحرک */}
        <div className="flex gap-1.5 items-center h-5">
          <span
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: 'var(--color-accent)',
              animationDelay: '0ms',
              animationDuration: '800ms',
            }}
          />
          <span
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: 'var(--color-accent)',
              animationDelay: '150ms',
              animationDuration: '800ms',
            }}
          />
          <span
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: 'var(--color-accent)',
              animationDelay: '300ms',
              animationDuration: '800ms',
            }}
          />
        </div>
      </div>
    </div>
  )
}
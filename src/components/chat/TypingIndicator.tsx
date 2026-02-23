// src/components/chat/TypingIndicator.tsx
// ─────────────────────────────────────
// انیمیشن تایپ MODO — Glass card + Smooth dots
// ─────────────────────────────────────

export default function TypingIndicator() {
  return (
    <>
      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>

      <div className="flex justify-end mb-4">
        {/* آواتار M */}
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] ml-2 mt-1"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-gradient-start), var(--color-accent-gradient-end))',
            color: '#FFFFFF',
          }}
        >
          M
        </div>

        <div
          className="rounded-2xl px-5 py-4"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: '4px 20px 20px 20px',
            boxShadow: '0 1px 4px var(--color-shadow)',
          }}
        >
          {/* سه نقطه */}
          <div className="flex gap-1.5 items-center h-5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  animation: 'typingDot 1.4s ease-in-out infinite',
                  animationDelay: `${i * 200}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
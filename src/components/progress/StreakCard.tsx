// src/components/progress/StreakCard.tsx
// ─────────────────────────────────────
// کارت Streak — هم‌رنگ تم
// ─────────────────────────────────────

import { Flame, Moon } from 'lucide-react'

interface StreakCardProps {
  streak: number
}

function getStreakMessage(streak: number): string {
  if (streak === 0) return 'امروز شروع کن! هر مسیری با یه قدم شروع میشه.'
  if (streak === 1) return 'شروع کردی! ادامه بده، فردا روز دومه.'
  if (streak < 3) return 'داری عادت میسازی. ادامه بده!'
  if (streak < 7) return 'چند روزه فعالی! داره عادت میشه.'
  if (streak < 14) return 'یه هفته‌ای شدی! این خیلی خوبه.'
  if (streak < 30) return 'دو هفته گذشت! داری ثابت میکنی جدی هستی.'
  if (streak < 60) return 'یه ماهه! تو الان یه آدم دیگه‌ای.'
  return 'افسانه‌ای! هیچ‌کس نمیتونه جلوتو بگیره.'
}

export default function StreakCard({ streak }: StreakCardProps) {
  const message = getStreakMessage(streak)
  const hasStreak = streak > 0

  return (
    <div
      className="modo-card text-center animate-slide-up"
      style={{
        boxShadow: hasStreak ? '0 4px 20px var(--color-shadow-accent)' : undefined,
        border: hasStreak ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
        style={{
          backgroundColor: 'var(--color-accent-glow)',
        }}
      >
        {hasStreak ? (
          <Flame size={32} style={{ color: 'var(--color-accent)' }} />
        ) : (
          <Moon size={32} style={{ color: 'var(--color-text-secondary)' }} />
        )}
      </div>

      <p
        className="text-4xl font-black mb-1"
        style={{ color: hasStreak ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
      >
        {streak}
      </p>
      <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>
        روز متوالی
      </p>

      <p className="text-sm leading-7" style={{ color: 'var(--color-text-primary)' }}>
        {message}
      </p>
    </div>
  )
}
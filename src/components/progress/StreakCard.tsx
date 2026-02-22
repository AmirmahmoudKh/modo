// src/components/progress/StreakCard.tsx
// ─────────────────────────────────────
// نمایش Streak با انیمیشن و پیام تشویقی
// ─────────────────────────────────────

interface StreakCardProps {
  streak: number
}

// پیام تشویقی بر اساس تعداد Streak
function getStreakMessage(streak: number): string {
  if (streak === 0) return 'امروز شروع کن! هر مسیری با یه قدم شروع میشه.'
  if (streak === 1) return 'شروع کردی! ادامه بده، فردا روز دومه. 💪'
  if (streak < 3) return 'داری عادت میسازی. ادامه بده!'
  if (streak < 7) return 'چند روزه فعالی! داره عادت میشه. 🔥'
  if (streak < 14) return 'یه هفته‌ای شدی! این خیلی خوبه. ⭐'
  if (streak < 30) return 'دو هفته گذشت! داری ثابت میکنی جدی هستی. 🏆'
  if (streak < 60) return 'یه ماهه! تو الان یه آدم دیگه‌ای. 👑'
  return 'افسانه‌ای! هیچ‌کس نمیتونه جلوتو بگیره. 🚀'
}

// رنگ بر اساس Streak
function getStreakColor(streak: number): string {
  if (streak === 0) return 'var(--color-text-secondary)'
  if (streak < 3) return 'var(--color-warning)'
  if (streak < 7) return '#F97316' // نارنجی
  if (streak < 14) return 'var(--color-accent)'
  return 'var(--color-success)'
}

export default function StreakCard({ streak }: StreakCardProps) {
  const message = getStreakMessage(streak)
  const color = getStreakColor(streak)

  return (
    <div
      className="rounded-2xl p-6 text-center"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* آتش */}
      <div className="text-5xl mb-3">
        {streak === 0 ? '💤' : '🔥'}
      </div>

      {/* عدد Streak */}
      <p
        className="text-4xl font-black mb-1"
        style={{ color }}
      >
        {streak}
      </p>
      <p
        className="text-sm font-medium mb-3"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        روز متوالی
      </p>

      {/* پیام تشویقی */}
      <p
        className="text-sm leading-7"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {message}
      </p>
    </div>
  )
}
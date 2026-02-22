// src/components/home/DashboardHeader.tsx
// ─────────────────────────────────────
// هدر داشبورد: سلام + اسم + لوگو
// ─────────────────────────────────────

interface DashboardHeaderProps {
  userName: string
}

// سلام مناسب بر اساس ساعت روز
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 6) return 'شب بخیر'
  if (hour < 12) return 'صبح بخیر'
  if (hour < 17) return 'ظهر بخیر'
  if (hour < 21) return 'عصر بخیر'
  return 'شب بخیر'
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  const greeting = getGreeting()

  return (
    <div className="flex items-center justify-between mb-6">
      {/* سلام */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {greeting}، {userName} 👋
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          امروز چه کاری می‌خوای انجام بدی؟
        </p>
      </div>

      {/* لوگو کوچک */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
        style={{
          backgroundColor: 'var(--color-accent)',
          color: '#FFFFFF',
        }}
      >
        M
      </div>
    </div>
  )
}
// src/components/home/DashboardHeader.tsx

interface DashboardHeaderProps {
  userName: string
}

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
      <div>
        <h1 className="text-2xl font-bold mb-1">
          <span style={{ color: 'var(--color-text-primary)' }}>{greeting}، </span>
          <span className="modo-gradient-text">{userName}</span>
        </h1>
        <p
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          امروز چه کاری می‌خوای انجام بدی؟
        </p>
      </div>

      {/* لوگو */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm modo-btn-primary"
      >
        M
      </div>
    </div>
  )
}
// src/components/progress/StatsOverview.tsx
// ─────────────────────────────────────
// آمار کلی: روزهای فعال، تعداد اهداف، تکمیل‌شده‌ها
// ─────────────────────────────────────

interface StatsOverviewProps {
  totalActiveDays: number
  totalGoals: number
  completedGoals: number
  totalChats: number
}

export default function StatsOverview({
  totalActiveDays,
  totalGoals,
  completedGoals,
  totalChats,
}: StatsOverviewProps) {
  const stats = [
    { icon: '📅', value: totalActiveDays, label: 'روز فعال' },
    { icon: '🎯', value: totalGoals, label: 'کل اهداف' },
    { icon: '✅', value: completedGoals, label: 'تکمیل‌شده' },
    { icon: '💬', value: totalChats, label: 'پیام چت' },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl p-3 text-center"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          <span className="text-xl block mb-1">{stat.icon}</span>
          <p
            className="text-lg font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {stat.value}
          </p>
          <p
            className="text-[10px]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}
// src/components/home/QuickStats.tsx
// ─────────────────────────────────────
// ۳ تا باکس آمار: Streak، تسک‌های امروز، اهداف فعال
// ─────────────────────────────────────

interface QuickStatsProps {
  streak: number
  todayTasks: number
  activeGoals: number
}

export default function QuickStats({ streak, todayTasks, activeGoals }: QuickStatsProps) {
  const stats = [
    {
      icon: '🔥',
      value: streak,
      label: 'Streak',
      unit: 'روز',
    },
    {
      icon: '✅',
      value: todayTasks,
      label: 'امروز',
      unit: 'تسک',
    },
    {
      icon: '🎯',
      value: activeGoals,
      label: 'فعال',
      unit: 'هدف',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl p-4 text-center"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          <span className="text-2xl block mb-1">{stat.icon}</span>
          <p
            className="text-xl font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {stat.value}
          </p>
          <p
            className="text-xs"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {stat.unit} {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}
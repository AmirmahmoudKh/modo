// src/components/home/QuickStats.tsx

import { Flame, CheckCircle2, Target } from 'lucide-react'

interface QuickStatsProps {
  streak: number
  todayTasks: number
  activeGoals: number
}

export default function QuickStats({ streak, todayTasks, activeGoals }: QuickStatsProps) {
  const stats = [
    {
      icon: Flame,
      value: streak,
      label: 'Streak',
      unit: 'روز',
      color: '#F97316',
    },
    {
      icon: CheckCircle2,
      value: todayTasks,
      label: 'امروز',
      unit: 'تسک',
      color: 'var(--color-success)',
    },
    {
      icon: Target,
      value: activeGoals,
      label: 'فعال',
      unit: 'هدف',
      color: 'var(--color-accent)',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="rounded-2xl p-4 text-center"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <Icon size={24} style={{ color: stat.color }} className="mx-auto mb-1" />
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
        )
      })}
    </div>
  )
}
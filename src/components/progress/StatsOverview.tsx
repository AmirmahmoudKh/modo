// src/components/progress/StatsOverview.tsx

import { Calendar, Target, CheckCircle2, MessageCircle } from 'lucide-react'

interface StatsOverviewProps {
  totalActiveDays: number
  totalGoals: number
  completedGoals: number
  totalChats: number
}

export default function StatsOverview({
  totalActiveDays, totalGoals, completedGoals, totalChats,
}: StatsOverviewProps) {
  const stats = [
    { icon: Calendar, value: totalActiveDays, label: 'روز فعال', color: 'var(--color-accent)' },
    { icon: Target, value: totalGoals, label: 'کل اهداف', color: '#F97316' },
    { icon: CheckCircle2, value: completedGoals, label: 'تکمیل‌شده', color: 'var(--color-success)' },
    { icon: MessageCircle, value: totalChats, label: 'پیام چت', color: 'var(--color-warning)' },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="rounded-2xl p-3 text-center"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <Icon size={20} style={{ color: stat.color }} className="mx-auto mb-1" />
            <p className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {stat.value}
            </p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
              {stat.label}
            </p>
          </div>
        )
      })}
    </div>
  )
}
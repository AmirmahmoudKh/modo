// src/components/progress/StatsOverview.tsx
// ─────────────────────────────────────
// آمار کلی — هم‌رنگ تم
// ─────────────────────────────────────

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
    { icon: Target, value: totalGoals, label: 'کل اهداف', color: 'var(--color-accent)' },
    { icon: CheckCircle2, value: completedGoals, label: 'تکمیل‌شده', color: 'var(--color-accent)' },
    { icon: MessageCircle, value: totalChats, label: 'پیام چت', color: 'var(--color-accent)' },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="modo-card text-center p-3 animate-fade-in"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1"
              style={{ backgroundColor: 'var(--color-accent-glow)' }}
            >
              <Icon size={16} style={{ color: stat.color }} />
            </div>
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
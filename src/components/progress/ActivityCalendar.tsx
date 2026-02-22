// src/components/progress/ActivityCalendar.tsx

import { Calendar } from 'lucide-react'
import type { DailyActivity } from '../../utils/db'

interface ActivityCalendarProps {
  activities: DailyActivity[]
}

const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

export default function ActivityCalendar({ activities }: ActivityCalendarProps) {
  const days: { date: string; active: boolean; tasks: number; isToday: boolean }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 34; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const activity = activities.find(a => a.date === dateStr)

    days.push({
      date: dateStr,
      active: activity?.active || false,
      tasks: activity?.tasksCompleted || 0,
      isToday: i === 0,
    })
  }

  function getCellOpacity(day: typeof days[0]): number {
    if (!day.active) return 0.15
    if (day.tasks >= 3) return 1
    if (day.tasks >= 1) return 0.6
    return 0.4
  }

  return (
    <div className="modo-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} style={{ color: 'var(--color-accent)' }} />
          <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
            تقویم فعالیت
          </p>
        </div>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          ۳۵ روز اخیر
        </p>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-medium py-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => (
          <div
            key={day.date}
            className="aspect-square rounded-lg flex items-center justify-center text-[10px] font-medium transition-all"
            style={{
              backgroundColor: day.active
                ? 'var(--color-accent)'
                : 'var(--color-bg-tertiary)',
              opacity: getCellOpacity(day),
              border: day.isToday
                ? '2px solid var(--color-accent)'
                : 'none',
              color: day.active ? '#FFFFFF' : 'var(--color-text-secondary)',
              boxShadow: day.isToday ? '0 0 8px var(--color-accent-glow)' : 'none',
            }}
          >
            {new Date(day.date).getDate()}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--color-bg-tertiary)', opacity: 0.15 }} />
          <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>غیرفعال</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--color-accent)', opacity: 0.4 }} />
          <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>فعال</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--color-accent)', opacity: 1 }} />
          <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>خیلی فعال</span>
        </div>
      </div>
    </div>
  )
}
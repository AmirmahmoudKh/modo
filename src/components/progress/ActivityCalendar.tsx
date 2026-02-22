// src/components/progress/ActivityCalendar.tsx
// ─────────────────────────────────────
// تقویم فعالیت ۳۰ روز اخیر
// مثل GitHub contribution graph
// ─────────────────────────────────────

import type { DailyActivity } from '../../utils/db'

interface ActivityCalendarProps {
  activities: DailyActivity[]
}

// اسم روزهای هفته
const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

export default function ActivityCalendar({ activities }: ActivityCalendarProps) {

  // ساخت ۳۵ روز اخیر (۵ هفته)
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

  // رنگ بر اساس فعالیت
  function getCellColor(day: typeof days[0]): string {
    if (!day.active) return 'var(--color-bg-tertiary)'
    if (day.tasks >= 3) return 'var(--color-accent)'
    if (day.tasks >= 1) return 'var(--color-accent)'
    return 'var(--color-accent)'
  }

  function getCellOpacity(day: typeof days[0]): number {
    if (!day.active) return 0.3
    if (day.tasks >= 3) return 1
    if (day.tasks >= 1) return 0.7
    return 0.5
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* هدر */}
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-sm font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          📅 تقویم فعالیت
        </p>
        <p
          className="text-xs"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          ۳۵ روز اخیر
        </p>
      </div>

      {/* اسم روزهای هفته */}
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

      {/* سلول‌های تقویم */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => (
          <div
            key={day.date}
            className="aspect-square rounded-lg flex items-center justify-center text-[10px] font-medium transition-all"
            style={{
              backgroundColor: getCellColor(day),
              opacity: getCellOpacity(day),
              border: day.isToday ? '2px solid var(--color-accent)' : 'none',
              color: day.active ? '#FFFFFF' : 'var(--color-text-secondary)',
            }}
            title={`${day.date}${day.active ? ` - ${day.tasks} تسک` : ''}`}
          >
            {new Date(day.date).getDate()}
          </div>
        ))}
      </div>

      {/* راهنما */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: 'var(--color-bg-tertiary)', opacity: 0.3 }}
          />
          <span
            className="text-[10px]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            غیرفعال
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: 'var(--color-accent)', opacity: 0.5 }}
          />
          <span
            className="text-[10px]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            فعال
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: 'var(--color-accent)', opacity: 1 }}
          />
          <span
            className="text-[10px]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            خیلی فعال
          </span>
        </div>
      </div>
    </div>
  )
}
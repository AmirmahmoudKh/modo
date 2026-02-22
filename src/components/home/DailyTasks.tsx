// src/components/home/DailyTasks.tsx

import { useState, useEffect } from 'react'
import { Check, ClipboardList, MessageCircle, Target } from 'lucide-react'
import { recordDailyActivity, getTodayString } from '../../utils/dbHelpers'

interface Task {
  id: string
  label: string
  icon: typeof ClipboardList
}

const DEFAULT_TASKS: Task[] = [
  { id: 'checkin',  label: 'چک‌این روزانه',  icon: ClipboardList },
  { id: 'chat',     label: 'یه چت با MODO',  icon: MessageCircle },
  { id: 'goal',     label: 'کار روی هدفم',   icon: Target },
]

export default function DailyTasks() {
  const todayKey = `tasks_${getTodayString()}`

  const [completedTasks, setCompletedTasks] = useState<string[]>(() => {
    const saved = localStorage.getItem(todayKey)
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem(todayKey, JSON.stringify(completedTasks))
    recordDailyActivity(completedTasks.length)
  }, [completedTasks, todayKey])

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="px-5 pt-4 pb-2 flex items-center gap-2">
        <ClipboardList size={16} style={{ color: 'var(--color-text-secondary)' }} />
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          تسک‌های امروز
        </p>
      </div>

      {DEFAULT_TASKS.map((task, index) => {
        const isCompleted = completedTasks.includes(task.id)
        const Icon = task.icon

        return (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="w-full px-5 py-4 flex items-center gap-4 transition-all duration-200 active:scale-[0.98]"
            style={{
              borderTop: index > 0 ? '1px solid var(--color-border)' : 'none',
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
              style={{
                backgroundColor: isCompleted ? 'var(--color-success)' : 'transparent',
                border: isCompleted ? 'none' : '2px solid var(--color-border)',
              }}
            >
              {isCompleted && <Check size={14} color="white" strokeWidth={3} />}
            </div>

            <Icon
              size={18}
              style={{
                color: isCompleted
                  ? 'var(--color-text-secondary)'
                  : 'var(--color-accent)',
              }}
            />

            <span
              className="font-medium transition-all duration-300"
              style={{
                color: isCompleted ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                textDecoration: isCompleted ? 'line-through' : 'none',
              }}
            >
              {task.label}
            </span>
          </button>
        )
      })}

      <div className="px-5 pb-4 pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {completedTasks.length} از {DEFAULT_TASKS.length}
          </span>
          {completedTasks.length === DEFAULT_TASKS.length && (
            <span className="text-xs font-bold" style={{ color: 'var(--color-success)' }}>
              عالی! همه رو انجام دادی
            </span>
          )}
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              backgroundColor: completedTasks.length === DEFAULT_TASKS.length
                ? 'var(--color-success)' : 'var(--color-accent)',
              width: `${(completedTasks.length / DEFAULT_TASKS.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
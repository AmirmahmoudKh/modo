// src/components/goals/GoalCard.tsx
// ─────────────────────────────────────
// کارت نمایش هر هدف
// ─────────────────────────────────────

import { Check, Trash2, Archive, RotateCcw } from 'lucide-react'
import type { Goal } from '../../utils/db'

interface GoalCardProps {
  goal: Goal
  onComplete: (id: number) => void
  onArchive: (id: number) => void
  onReactivate: (id: number) => void
  onDelete: (id: number) => void
}

// تبدیل تاریخ به "X روز پیش"
function timeAgo(date: Date): string {
  const now = new Date()
  const diff = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))

  if (diff === 0) return 'امروز'
  if (diff === 1) return 'دیروز'
  if (diff < 7) return `${diff} روز پیش`
  if (diff < 30) return `${Math.floor(diff / 7)} هفته پیش`
  return `${Math.floor(diff / 30)} ماه پیش`
}

export default function GoalCard({ goal, onComplete, onArchive, onReactivate, onDelete }: GoalCardProps) {

  const statusConfig = {
    active: {
      icon: '⚡',
      borderColor: 'var(--color-accent)',
      bgColor: 'var(--color-bg-secondary)',
    },
    completed: {
      icon: '✅',
      borderColor: 'var(--color-success)',
      bgColor: 'var(--color-bg-secondary)',
    },
    archived: {
      icon: '📦',
      borderColor: 'var(--color-border)',
      bgColor: 'var(--color-bg-secondary)',
    },
  }

  const config = statusConfig[goal.status]

  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200"
            style={{
        backgroundColor: config.bgColor,
        border: '1px solid var(--color-border)',
        borderRight: `4px solid ${config.borderColor}`,
      }}
    >
      {/* بالا: آیکون + عنوان + تاریخ */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xl mt-0.5">{config.icon}</span>
        <div className="flex-1">
          <h3
            className="font-bold text-base"
            style={{
              color: 'var(--color-text-primary)',
              textDecoration: goal.status === 'completed' ? 'line-through' : 'none',
              opacity: goal.status === 'archived' ? 0.6 : 1,
            }}
          >
            {goal.title}
          </h3>

          {goal.description && (
            <p
              className="text-sm mt-1"
              style={{
                color: 'var(--color-text-secondary)',
                opacity: goal.status === 'archived' ? 0.6 : 1,
              }}
            >
              {goal.description}
            </p>
          )}

          <p
            className="text-xs mt-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {goal.status === 'completed' && goal.completedAt
              ? `تکمیل شده: ${timeAgo(goal.completedAt)}`
              : `ساخته شده: ${timeAgo(goal.createdAt)}`
            }
          </p>
        </div>
      </div>

      {/* پایین: دکمه‌های عملیات */}
      <div className="flex items-center gap-2 justify-end">
        {/* دکمه‌ها بر اساس وضعیت */}
        {goal.status === 'active' && (
          <>
            <button
              onClick={() => onComplete(goal.id!)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95"
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: 'var(--color-success)',
              }}
            >
              <Check size={14} />
              تکمیل
            </button>

            <button
              onClick={() => onArchive(goal.id!)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <Archive size={14} />
              آرشیو
            </button>
          </>
        )}

        {goal.status === 'completed' && (
          <button
            onClick={() => onReactivate(goal.id!)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <RotateCcw size={14} />
            فعال‌سازی مجدد
          </button>
        )}

        {goal.status === 'archived' && (
          <button
            onClick={() => onReactivate(goal.id!)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <RotateCcw size={14} />
            بازگردانی
          </button>
        )}

        {/* دکمه حذف (همیشه) */}
        <button
          onClick={() => {
            if (window.confirm('مطمئنی میخوای این هدف رو حذف کنی؟')) {
              onDelete(goal.id!)
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--color-danger)',
          }}
        >
          <Trash2 size={14} />
          حذف
        </button>
      </div>
    </div>
  )
}
// src/components/goals/GoalCard.tsx

import { Check, Trash2, Archive, RotateCcw, Zap, CheckCircle2, Package } from 'lucide-react'
import type { Goal } from '../../utils/db'

interface GoalCardProps {
  goal: Goal
  onComplete: (id: number) => void
  onArchive: (id: number) => void
  onReactivate: (id: number) => void
  onDelete: (id: number) => void
}

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
    active: { icon: Zap, borderColor: 'var(--color-accent)', iconColor: 'var(--color-accent)' },
    completed: { icon: CheckCircle2, borderColor: 'var(--color-success)', iconColor: 'var(--color-success)' },
    archived: { icon: Package, borderColor: 'var(--color-border)', iconColor: 'var(--color-text-secondary)' },
  }

  const config = statusConfig[goal.status]
  const StatusIcon = config.icon

  return (
    <div
      className="modo-card animate-fade-in"
      style={{
        border: '1px solid var(--color-border)',
        borderRight: `4px solid ${config.borderColor}`,
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: `${config.borderColor}15` }}
        >
          <StatusIcon size={18} style={{ color: config.iconColor }} />
        </div>
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
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)', opacity: goal.status === 'archived' ? 0.6 : 1 }}>
              {goal.description}
            </p>
          )}
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            {goal.status === 'completed' && goal.completedAt
              ? `تکمیل شده: ${timeAgo(goal.completedAt)}`
              : `ساخته شده: ${timeAgo(goal.createdAt)}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end">
        {goal.status === 'active' && (
          <>
            <button onClick={() => onComplete(goal.id!)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' }}>
              <Check size={14} /> تکمیل
            </button>
            <button onClick={() => onArchive(goal.id!)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}>
              <Archive size={14} /> آرشیو
            </button>
          </>
        )}
        {(goal.status === 'completed' || goal.status === 'archived') && (
          <button onClick={() => onReactivate(goal.id!)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}>
            <RotateCcw size={14} /> {goal.status === 'completed' ? 'فعال‌سازی مجدد' : 'بازگردانی'}
          </button>
        )}
        <button onClick={() => { if (window.confirm('مطمئنی؟')) onDelete(goal.id!) }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)' }}>
          <Trash2 size={14} /> حذف
        </button>
      </div>
    </div>
  )
}
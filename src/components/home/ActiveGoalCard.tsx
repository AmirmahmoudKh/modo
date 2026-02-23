// src/components/home/ActiveGoalCard.tsx
// ─────────────────────────────────────
// نمایش هدف فعال در داشبورد
// ─────────────────────────────────────

import { useNavigate } from 'react-router-dom'
import { Plus, ChevronLeft, Target } from 'lucide-react'
import type { Goal } from '../../utils/db'

interface ActiveGoalCardProps {
  goal: Goal | null
}

export default function ActiveGoalCard({ goal }: ActiveGoalCardProps) {
  const navigate = useNavigate()

  if (!goal) {
    return (
      <button
        onClick={() => navigate('/goals')}
        className="w-full rounded-2xl p-5 transition-all duration-200 active:scale-[0.98]"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '2px dashed var(--color-border)',
        }}
      >
        <div className="flex items-center justify-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-accent-glow)' }}
          >
            <Plus size={20} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div className="text-right">
            <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
              اولین هدفت رو بساز
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              با یه هدف کوچیک شروع کن
            </p>
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={() => navigate('/goals')}
      className="w-full modo-card transition-all duration-200 active:scale-[0.98]"
    >
      {/* لیبل */}
      <div className="flex items-center gap-1.5 mb-2">
        <Target size={12} style={{ color: 'var(--color-accent)' }} />
        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          هدف فعال
        </span>
      </div>

      {/* عنوان */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <p className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
            {goal.title}
          </p>
          {goal.description && (
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {goal.description}
            </p>
          )}
        </div>
        <ChevronLeft size={20} style={{ color: 'var(--color-text-secondary)' }} />
      </div>
    </button>
  )
}
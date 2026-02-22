// src/components/home/ActiveGoalCard.tsx
// ─────────────────────────────────────
// نمایش هدف فعال در داشبورد
// اگه هدفی نداره → پیشنهاد ساخت هدف
// ─────────────────────────────────────

import { useNavigate } from 'react-router-dom'
import { Plus, ChevronLeft } from 'lucide-react'
import type { Goal } from '../../utils/db'

interface ActiveGoalCardProps {
  goal: Goal | null  // null یعنی هدفی نداره
}

export default function ActiveGoalCard({ goal }: ActiveGoalCardProps) {
  const navigate = useNavigate()

  // ─── حالت بدون هدف ───
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
          <Plus
            size={20}
            style={{ color: 'var(--color-accent)' }}
          />
          <div className="text-right">
            <p
              className="font-medium"
              style={{ color: 'var(--color-text-primary)' }}
            >
              اولین هدفت رو بساز
            </p>
            <p
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              با یه هدف کوچیک شروع کن
            </p>
          </div>
        </div>
      </button>
    )
  }

  // ─── حالت با هدف ───
  return (
    <button
      onClick={() => navigate('/goals')}
      className="w-full rounded-2xl p-5 transition-all duration-200 active:scale-[0.98]"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* لیبل */}
      <p
        className="text-xs mb-2"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        🎯 هدف فعال
      </p>

      {/* عنوان هدف */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <p
            className="font-bold text-lg"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {goal.title}
          </p>
          {goal.description && (
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {goal.description}
            </p>
          )}
        </div>

        <ChevronLeft
          size={20}
          style={{ color: 'var(--color-text-secondary)' }}
        />
      </div>
    </button>
  )
}
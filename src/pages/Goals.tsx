// src/pages/Goals.tsx
// ─────────────────────────────────────
// صفحه مدیریت اهداف
// ─────────────────────────────────────

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import GoalCard from '../components/goals/GoalCard'
import GoalForm from '../components/goals/GoalForm'
import {
  getAllGoals,
  createGoal,
  completeGoal,
  archiveGoal,
  updateGoal,
  deleteGoal,
  earnBadge,
  checkAndAwardBadges,
} from '../utils/dbHelpers'
import type { Goal } from '../utils/db'

// فیلترها
type FilterType = 'active' | 'completed' | 'archived'

const FILTERS: { value: FilterType; label: string; icon: string }[] = [
  { value: 'active',    label: 'فعال',       icon: '⚡' },
  { value: 'completed', label: 'تکمیل‌شده',  icon: '✅' },
  { value: 'archived',  label: 'آرشیو',      icon: '📦' },
]

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [filter, setFilter] = useState<FilterType>('active')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  // ─── لود اهداف ───
  const loadGoals = async () => {
    try {
      const allGoals = await getAllGoals()
      setGoals(allGoals)
    } catch (error) {
      console.error('خطا در بارگذاری اهداف:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGoals()
  }, [])

  // ─── فیلتر اهداف ───
  const filteredGoals = goals.filter(g => g.status === filter)

  // ─── تعداد هر وضعیت ───
  const counts = {
    active: goals.filter(g => g.status === 'active').length,
    completed: goals.filter(g => g.status === 'completed').length,
    archived: goals.filter(g => g.status === 'archived').length,
  }

  // ─── عملیات ───
  const handleCreate = async (title: string, description: string) => {
    await createGoal(title, description)
    await earnBadge('first_goal')
    await loadGoals()
    setShowForm(false)
  }

  const handleComplete = async (id: number) => {
    await completeGoal(id)
    await checkAndAwardBadges()
    await loadGoals()
  }

  const handleArchive = async (id: number) => {
    await archiveGoal(id)
    await loadGoals()
  }

  const handleReactivate = async (id: number) => {
    await updateGoal(id, { status: 'active', completedAt: undefined })
    await loadGoals()
  }

  const handleDelete = async (id: number) => {
    await deleteGoal(id)
    await loadGoals()
  }

  // ─── لودینگ ───
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div
          className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{
            borderColor: 'var(--color-border)',
            borderTopColor: 'var(--color-accent)',
          }}
        />
      </div>
    )
  }

  return (
    <div className="p-6 pb-24">
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          🎯 اهداف من
        </h1>
        <span
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {goals.length} هدف
        </span>
      </div>

      {/* فیلترها */}
      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95"
            style={{
              backgroundColor: filter === f.value
                ? 'var(--color-accent)'
                : 'var(--color-bg-secondary)',
              color: filter === f.value
                ? '#FFFFFF'
                : 'var(--color-text-secondary)',
              border: `1px solid ${filter === f.value
                ? 'var(--color-accent)'
                : 'var(--color-border)'}`,
            }}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
            <span
              className="px-1.5 py-0.5 rounded-lg text-[10px]"
              style={{
                backgroundColor: filter === f.value
                  ? 'rgba(255,255,255,0.2)'
                  : 'var(--color-bg-tertiary)',
              }}
            >
              {counts[f.value]}
            </span>
          </button>
        ))}
      </div>

      {/* لیست اهداف */}
      {filteredGoals.length > 0 ? (
        <div className="space-y-3">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onComplete={handleComplete}
              onArchive={handleArchive}
              onReactivate={handleReactivate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        // حالت خالی
        <div
          className="rounded-2xl p-8 text-center mt-8"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '2px dashed var(--color-border)',
          }}
        >
          <span className="text-4xl block mb-3">
            {filter === 'active' ? '🎯' : filter === 'completed' ? '🏆' : '📦'}
          </span>
          <p
            className="font-medium mb-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {filter === 'active'
              ? 'هنوز هدف فعالی نداری'
              : filter === 'completed'
                ? 'هنوز هدفی تکمیل نشده'
                : 'آرشیو خالیه'
            }
          </p>
          <p
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {filter === 'active'
              ? 'با یه هدف کوچیک شروع کن!'
              : filter === 'completed'
                ? 'اهداف فعالت رو تکمیل کن'
                : 'اهدافی که فعلاً بهشون نمی‌رسی رو آرشیو کن'
            }
          </p>

          {filter === 'active' && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-6 py-3 rounded-xl font-medium transition-all active:scale-95"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: '#FFFFFF',
              }}
            >
              + اولین هدفت رو بساز
            </button>
          )}
        </div>
      )}

      {/* دکمه شناور ساخت هدف */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed left-6 bottom-24 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 hover:scale-110"
        style={{
          backgroundColor: 'var(--color-accent)',
          color: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(108, 99, 255, 0.4)',
        }}
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      {/* فرم ساخت هدف */}
      {showForm && (
        <GoalForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
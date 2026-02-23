// src/components/home/TaskItem.tsx
// ─────────────────────────────────────
// کامپوننت تسک - با قابلیت سوایپ برای حذف
// ─────────────────────────────────────

import { useState, useRef } from 'react'
import { Check, Trash2 } from 'lucide-react'
import type { Task } from '../../utils/db'

interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [swipeX, setSwipeX] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const hasMoved = useRef(false)

  const typeLabel: Record<string, string> = {
    auto: 'پیشنهاد MODO',
    manual: 'تسک من',
    habit: 'عادت روزانه',
  }

  const typeColor: Record<string, string> = {
    auto: 'var(--color-accent)',
    manual: 'var(--color-warning)',
    habit: 'var(--color-accent)',
  }

  // ─── Touch Handlers ───
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    hasMoved.current = false
    setIsSwiping(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return

    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const deltaX = currentX - touchStartX.current
    const deltaY = Math.abs(currentY - touchStartY.current)

    if (deltaY > 15 && Math.abs(deltaX) < 15) {
      setIsSwiping(false)
      setSwipeX(0)
      return
    }

    if (deltaX > 5) {
      hasMoved.current = true
      setSwipeX(Math.min(deltaX, 100))
    }
  }

  const handleTouchEnd = () => {
    if (swipeX > 70) {
      onDelete(task.id!)
    }
    setSwipeX(0)
    setIsSwiping(false)
  }

  const handleClick = () => {
    if (hasMoved.current) return
    onToggle(task.id!)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl mb-3">
      {/* پس‌زمینه قرمز Delete */}
      <div
        className="absolute inset-0 flex items-center rounded-2xl px-5"
        style={{ backgroundColor: '#ef4444' }}
      >
        <div className="flex items-center gap-2 text-white">
          <Trash2 size={18} />
          <span className="text-sm font-medium">حذف</span>
        </div>
      </div>

      {/* محتوای تسک */}
      <div
        className="relative rounded-2xl p-4 flex items-center gap-3"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: `1px solid ${task.completed ? 'var(--color-accent)' : 'var(--color-border)'}`,
          transform: `translateX(${swipeX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        {/* دکمه تیک */}
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center"
          style={{
            borderColor: task.completed ? 'var(--color-accent)' : 'var(--color-border)',
            backgroundColor: task.completed ? 'var(--color-accent)' : 'transparent',
            transition: 'all 0.3s ease',
          }}
        >
          {task.completed && <Check size={14} color="#fff" strokeWidth={3} />}
        </div>

        {/* آیکون */}
        <span className="text-lg flex-shrink-0">{task.icon}</span>

        {/* متن */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium"
            style={{
              color: task.completed ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
              textDecoration: task.completed ? 'line-through' : 'none',
              opacity: task.completed ? 0.6 : 1,
              transition: 'all 0.3s ease',
            }}
          >
            {task.title}
          </p>
          <span
            className="text-[10px] font-medium"
            style={{ color: typeColor[task.type] || 'var(--color-text-secondary)' }}
          >
            {typeLabel[task.type] || task.type}
          </span>
        </div>
      </div>
    </div>
  )
}
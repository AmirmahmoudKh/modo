// src/components/home/DailyTasks.tsx
// ─────────────────────────────────────
// سیستم تسک هوشمند روزانه
// ─────────────────────────────────────

import { useState, useEffect } from 'react'
import { Plus, ListChecks, X } from 'lucide-react'
import TaskItem from './TaskItem'
import {
  ensureTodayTasks,
  toggleTask,
  addManualTask,
  deleteTask,
  checkAndAwardBadges,
} from '../../utils/dbHelpers'
import type { Task } from '../../utils/db'

interface DailyTasksProps {
  onTaskChange?: (completed: number) => void
}

export default function DailyTasks({ onTaskChange }: DailyTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  // ─── لود تسک‌ها ───
  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    try {
      const todayTasks = await ensureTodayTasks()
      setTasks(todayTasks)
      notifyParent(todayTasks)
    } catch (err) {
      console.error('خطا در بارگذاری تسک‌ها:', err)
    } finally {
      setLoading(false)
    }
  }

  function notifyParent(taskList: Task[]) {
    if (onTaskChange) {
      const completed = taskList.filter(t => t.completed).length
      onTaskChange(completed)
    }
  }

  // ─── تیک زدن ───
  const handleToggle = async (id: number) => {
    await toggleTask(id)
    await checkAndAwardBadges()

    setTasks(prev => {
      const updated = prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
      notifyParent(updated)
      return updated
    })
  }

  // ─── حذف (سوایپ) ───
  const handleDelete = async (id: number) => {
    await deleteTask(id)
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== id)
      notifyParent(updated)
      return updated
    })
  }

  // ─── اضافه کردن تسک ───
  const handleAddTask = async () => {
    const title = newTaskTitle.trim()
    if (!title) return

    const id = await addManualTask(title)
    const newTask: Task = {
      id,
      title,
      type: 'manual',
      completed: false,
      date: new Date().toISOString().split('T')[0],
      icon: '📌',
      createdAt: new Date(),
    }

    setTasks(prev => {
      const updated = [...prev, newTask]
      notifyParent(updated)
      return updated
    })

    setNewTaskTitle('')
    setShowAddForm(false)
  }

  // ─── کلید Enter ───
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddTask()
    if (e.key === 'Escape') {
      setShowAddForm(false)
      setNewTaskTitle('')
    }
  }

  // ─── لودینگ ───
  if (loading) {
    return (
      <div className="modo-card">
        <div className="animate-pulse space-y-3">
          <div className="h-5 rounded w-1/3" style={{ backgroundColor: 'var(--color-bg-tertiary)' }} />
          <div className="h-14 rounded-xl" style={{ backgroundColor: 'var(--color-bg-tertiary)' }} />
          <div className="h-14 rounded-xl" style={{ backgroundColor: 'var(--color-bg-tertiary)' }} />
          <div className="h-14 rounded-xl" style={{ backgroundColor: 'var(--color-bg-tertiary)' }} />
        </div>
      </div>
    )
  }

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const allDone = totalCount > 0 && completedCount === totalCount

  return (
    <div className="modo-card">
      {/* هدر */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ListChecks size={20} style={{ color: 'var(--color-accent)' }} />
          <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
            تسک‌های امروز
          </h3>
          {totalCount > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: allDone ? 'var(--color-accent-glow)' : 'var(--color-bg-tertiary)',
                color: allDone ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              }}
            >
              {completedCount}/{totalCount}
            </span>
          )}
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 rounded-xl transition-all active:scale-90"
          style={{
            backgroundColor: showAddForm ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
            color: showAddForm ? '#fff' : 'var(--color-accent)',
          }}
        >
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
        </button>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div
          className="h-2 rounded-full mb-4 overflow-hidden"
          style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${(completedCount / totalCount) * 100}%`,
              background: allDone
                ? `linear-gradient(135deg, var(--color-accent-gradient-start), var(--color-accent-gradient-end))`
                : 'var(--color-accent)',
              transition: 'width 0.5s ease, background 0.3s ease',
              boxShadow: allDone ? '0 0 8px var(--color-accent-glow)' : 'none',
            }}
          />
        </div>
      )}

      {/* فرم اضافه کردن */}
      {showAddForm && (
        <div
          className="flex items-center gap-2 mb-4 p-3 rounded-xl animate-fade-in"
          style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            border: '1px solid var(--color-border)',
          }}
        >
          <span className="text-lg">📌</span>
          <input
            type="text"
            placeholder="مثلاً: زنگ بزن به دانشگاه"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--color-text-primary)' }}
          />
          <button
            onClick={handleAddTask}
            disabled={!newTaskTitle.trim()}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-40"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            افزودن
          </button>
        </div>
      )}

      {/* لیست تسک‌ها */}
      {tasks.length === 0 ? (
        <div className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm">هنوز تسکی نداری</p>
          <p className="text-xs mt-1">با دکمه + یه تسک اضافه کن</p>
        </div>
      ) : (
        <div>
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* پیام تکمیل همه تسک‌ها */}
      {allDone && (
        <div
          className="text-center py-3 mt-2 rounded-xl animate-scale-in"
          style={{
            backgroundColor: 'var(--color-accent-glow)',
            color: 'var(--color-accent)',
          }}
        >
          <p className="text-lg mb-1">🎉</p>
          <p className="text-sm font-medium">آفرین! همه تسک‌های امروز انجام شد!</p>
        </div>
      )}
    </div>
  )
}
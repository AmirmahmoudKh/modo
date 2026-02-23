// src/components/goals/GoalForm.tsx
// ─────────────────────────────────────
// فرم ساخت هدف جدید — بدون ایموجی
// ─────────────────────────────────────

import { useState } from 'react'
import { X, Target, Lightbulb, Check } from 'lucide-react'

interface GoalFormProps {
  onSubmit: (title: string, description: string) => void
  onClose: () => void
}

const SUGGESTIONS = [
  { title: 'خواب منظم', desc: 'هر شب ساعت ۱۱ بخوابم' },
  { title: 'ورزش روزانه', desc: 'هر روز ۳۰ دقیقه ورزش کنم' },
  { title: 'مطالعه', desc: 'هر روز ۲۰ دقیقه کتاب بخونم' },
  { title: 'کاهش اسکرین تایم', desc: 'روزی حداکثر ۳ ساعت گوشی' },
  { title: 'یادگیری مهارت', desc: 'هر روز ۳۰ دقیقه تمرین' },
  { title: 'نوشتن روزانه', desc: 'هر شب ۳ خط درباره روزم بنویسم' },
]

export default function GoalForm({ onSubmit, onClose }: GoalFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const isValid = title.trim().length >= 2

  const handleSubmit = () => {
    if (!isValid) return
    onSubmit(title.trim(), description.trim())
  }

  const selectSuggestion = (s: typeof SUGGESTIONS[0]) => {
    setTitle(s.title)
    setDescription(s.desc)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-overlay)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-lg rounded-3xl p-6 max-h-[85vh] overflow-y-auto animate-scale-in"
        style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}
      >
        {/* هدر */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Target size={22} style={{ color: 'var(--color-accent)' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>هدف جدید</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl transition-all active:scale-90" style={{ color: 'var(--color-text-secondary)' }}>
            <X size={22} />
          </button>
        </div>

        {/* فرم */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>عنوان هدف</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: خواب منظم"
              className="w-full p-4 rounded-2xl text-base outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                color: 'var(--color-text-primary)',
                border: `2px solid ${isValid ? 'var(--color-accent)' : 'var(--color-border)'}`,
              }}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>توضیحات (اختیاری)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثلاً: هر شب ساعت ۱۱ بخوابم و ساعت ۷ بیدار شم"
              rows={3}
              className="w-full p-4 rounded-2xl text-sm outline-none resize-none transition-all"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                color: 'var(--color-text-primary)',
                border: '2px solid var(--color-border)',
              }}
            />
          </div>
        </div>

        {/* پیشنهادات */}
        <div className="mt-6">
          <div className="flex items-center gap-1.5 mb-3">
            <Lightbulb size={14} style={{ color: 'var(--color-accent)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              یا یکی از اینا رو انتخاب کن:
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.title}
                onClick={() => selectSuggestion(s)}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95"
                style={{
                  backgroundColor: title === s.title ? 'var(--color-accent-light)' : 'var(--color-bg-secondary)',
                  color: title === s.title ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  border: `1px solid ${title === s.title ? 'var(--color-accent)' : 'var(--color-border)'}`,
                }}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* دکمه ثبت */}
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full mt-6 py-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            backgroundColor: isValid ? 'var(--color-accent)' : 'var(--color-border)',
            color: isValid ? '#FFFFFF' : 'var(--color-text-secondary)',
          }}
        >
          <Check size={20} />
          <span>ثبت هدف</span>
        </button>
      </div>
    </div>
  )
}
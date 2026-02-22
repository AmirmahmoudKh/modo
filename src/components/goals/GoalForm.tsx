// src/components/goals/GoalForm.tsx
// ─────────────────────────────────────
// فرم ساخت هدف جدید (Modal/Popup)
// ─────────────────────────────────────

import { useState } from 'react'
import { X } from 'lucide-react'

interface GoalFormProps {
  onSubmit: (title: string, description: string) => void
  onClose: () => void
}

// پیشنهادات هدف
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

  // انتخاب پیشنهاد
  const selectSuggestion = (s: typeof SUGGESTIONS[0]) => {
    setTitle(s.title)
    setDescription(s.desc)
  }

  return (
    // ─── Overlay (پس‌زمینه تیره) ───
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* ─── Modal ─── */}
      <div
        className="w-full max-w-lg rounded-3xl p-6 max-h-[85vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* هدر */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            🎯 هدف جدید
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-all active:scale-90"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* فرم */}
        <div className="space-y-4">
          {/* عنوان */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              عنوان هدف *
            </label>
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

          {/* توضیحات */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              توضیحات (اختیاری)
            </label>
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
          <p
            className="text-sm font-medium mb-3"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            💡 یا یکی از اینا رو انتخاب کن:
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.title}
                onClick={() => selectSuggestion(s)}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95"
                style={{
                  backgroundColor: title === s.title
                    ? 'var(--color-accent-light)'
                    : 'var(--color-bg-secondary)',
                  color: title === s.title
                    ? 'var(--color-accent)'
                    : 'var(--color-text-secondary)',
                  border: `1px solid ${title === s.title
                    ? 'var(--color-accent)'
                    : 'var(--color-border)'}`,
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
          className="w-full mt-6 py-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98]"
          style={{
            backgroundColor: isValid ? 'var(--color-accent)' : 'var(--color-border)',
            color: isValid ? '#FFFFFF' : 'var(--color-text-secondary)',
          }}
        >
          ✅ ثبت هدف
        </button>
      </div>
    </div>
  )
}
// src/pages/EditProfile.tsx
// ─────────────────────────────────────
// ویرایش پروفایل — آیکون Lucide + پولیش
// ─────────────────────────────────────

import { useState, useEffect } from 'react'
import {
  ArrowRight,
  Save,
  User,
  Calendar,
  Briefcase,
  Target,
  Moon,
  Brain,
  Smartphone,
  CheckCircle2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getUserProfile } from '../utils/dbHelpers'
import { db } from '../utils/db'
import type { UserProfile } from '../utils/db'

const STATUS_OPTIONS = [
  { value: 'highschool', label: 'دانش‌آموز' },
  { value: 'student',    label: 'دانشجو' },
  { value: 'employed',   label: 'شاغل' },
  { value: 'freelancer', label: 'فریلنسر' },
  { value: 'jobseeker',  label: 'جویای کار' },
  { value: 'other',      label: 'سایر' },
]

const GOAL_OPTIONS = [
  { value: 'routine',  label: 'ساختن روتین روزانه' },
  { value: 'purpose',  label: 'پیدا کردن هدف و مسیر' },
  { value: 'focus',    label: 'بهبود تمرکز' },
  { value: 'sleep',    label: 'خواب بهتر' },
  { value: 'skills',   label: 'یادگیری مهارت جدید' },
  { value: 'mental',   label: 'سلامت روان' },
  { value: 'screen',   label: 'کاهش اسکرین تایم' },
  { value: 'time',     label: 'مدیریت زمان' },
]

const SLEEP_OPTIONS = [
  { value: 'before-22', label: 'قبل ۱۰ شب' },
  { value: '22-23',     label: '۱۰ تا ۱۱ شب' },
  { value: '23-00',     label: '۱۱ تا ۱۲ شب' },
  { value: '00-01',     label: '۱۲ تا ۱ شب' },
  { value: 'after-01',  label: 'بعد از ۱ شب' },
]

const FOCUS_OPTIONS = [
  { value: 'great',     label: 'عالی' },
  { value: 'medium',    label: 'متوسط' },
  { value: 'weak',      label: 'ضعیف' },
  { value: 'very-weak', label: 'خیلی ضعیف' },
]

const SCREEN_OPTIONS = [
  { value: 'under-2', label: 'کمتر از ۲ ساعت' },
  { value: '2-4',     label: '۲ تا ۴ ساعت' },
  { value: '4-6',     label: '۴ تا ۶ ساعت' },
  { value: '6-8',     label: '۶ تا ۸ ساعت' },
  { value: 'over-8',  label: 'بیشتر از ۸ ساعت' },
]

export default function EditProfile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [status, setStatus] = useState('')
  const [goals, setGoals] = useState<string[]>([])
  const [sleepTime, setSleepTime] = useState('')
  const [focusLevel, setFocusLevel] = useState('')
  const [screenTime, setScreenTime] = useState('')

  useEffect(() => {
    async function load() {
      const p = await getUserProfile()
      if (p) {
        setProfile(p)
        setName(p.name)
        setAge(String(p.age))
        setStatus(p.status)
        setGoals(p.goals)
        setSleepTime(p.sleepTime)
        setFocusLevel(p.focusLevel)
        setScreenTime(p.screenTime)
      }
      setLoading(false)
    }
    load()
  }, [])

  const toggleGoal = (value: string) => {
    setGoals(prev =>
      prev.includes(value) ? prev.filter(g => g !== value) : [...prev, value]
    )
  }

  const handleSave = async () => {
    if (!profile?.id) return
    setSaving(true)
    try {
      await db.userProfile.update(profile.id, {
        name: name.trim(),
        age: parseInt(age),
        status,
        goals,
        sleepTime,
        focusLevel,
        screenTime,
      })
      setSaved(true)
      setTimeout(() => navigate('/settings'), 1000)
    } catch (error) {
      console.error('خطا در ذخیره:', error)
      alert('مشکلی پیش اومد')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-accent)' }} />
      </div>
    )
  }

  // ─── تابع کمکی: گرید دکمه‌ها ───
  function renderChips(
    options: { value: string; label: string }[],
    selected: string,
    onSelect: (v: string) => void,
    cols: number = 3
  ) {
    return (
      <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="p-3 rounded-xl text-sm font-medium transition-all active:scale-95"
            style={{
              backgroundColor: selected === opt.value ? 'var(--color-accent-light)' : 'var(--color-bg-secondary)',
              color: selected === opt.value ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              border: `1px solid ${selected === opt.value ? 'var(--color-accent)' : 'var(--color-border)'}`,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 pb-24">
      {/* هدر */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-xl transition-all active:scale-90"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          ویرایش پروفایل
        </h1>
      </div>

      <div className="space-y-5">
        {/* اسم */}
        <div className="modo-card">
          <div className="flex items-center gap-2 mb-3">
            <User size={16} style={{ color: 'var(--color-accent)' }} />
            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>اسم</label>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 rounded-2xl outline-none"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
            }}
          />
        </div>

        {/* سن */}
        <div className="modo-card">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} style={{ color: 'var(--color-accent)' }} />
            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>سن</label>
          </div>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-4 rounded-2xl outline-none"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
            }}
          />
        </div>

        {/* وضعیت */}
        <div className="modo-card">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase size={16} style={{ color: 'var(--color-accent)' }} />
            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>وضعیت</label>
          </div>
          {renderChips(STATUS_OPTIONS, status, setStatus, 3)}
        </div>

        {/* اهداف */}
        <div className="modo-card">
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} style={{ color: 'var(--color-accent)' }} />
            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>اهداف</label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {GOAL_OPTIONS.map((opt) => {
              const isSelected = goals.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleGoal(opt.value)}
                  className="p-3 rounded-xl text-sm font-medium transition-all active:scale-95 text-right"
                  style={{
                    backgroundColor: isSelected ? 'var(--color-accent-light)' : 'var(--color-bg-secondary)',
                    color: isSelected ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ساعت خواب */}
        <div className="modo-card">
          <div className="flex items-center gap-2 mb-3">
            <Moon size={16} style={{ color: 'var(--color-accent)' }} />
            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>ساعت خواب</label>
          </div>
          {renderChips(SLEEP_OPTIONS, sleepTime, setSleepTime, 3)}
        </div>

        {/* تمرکز */}
        <div className="modo-card">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} style={{ color: 'var(--color-accent)' }} />
            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>سطح تمرکز</label>
          </div>
          {renderChips(FOCUS_OPTIONS, focusLevel, setFocusLevel, 4)}
        </div>

        {/* اسکرین تایم */}
        <div className="modo-card">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone size={16} style={{ color: 'var(--color-accent)' }} />
            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>اسکرین تایم روزانه</label>
          </div>
          {renderChips(SCREEN_OPTIONS, screenTime, setScreenTime, 3)}
        </div>
      </div>

      {/* دکمه ذخیره */}
      <button
        onClick={handleSave}
        disabled={saving || !name.trim()}
        className="w-full mt-8 py-4 rounded-2xl font-bold text-lg modo-btn modo-btn-primary flex items-center justify-center gap-2"
        style={{ opacity: saving ? 0.7 : 1 }}
      >
        {saved ? (
          <><CheckCircle2 size={20} /><span>ذخیره شد</span></>
        ) : saving ? (
          <span>در حال ذخیره...</span>
        ) : (
          <><Save size={20} /><span>ذخیره تغییرات</span></>
        )}
      </button>
    </div>
  )
}
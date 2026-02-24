// src/pages/Onboarding.tsx
// ─────────────────────────────────────
// آنبوردینگ: ۱۰ مرحله (۰ تا ۹)
// بدون ایموجی — فقط آیکون Lucide
// ─────────────────────────────────────

import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Briefcase,
  Laptop,
  Search,
  Pin,
  Sunrise,
  Compass,
  Brain,
  Moon,
  Heart,
  Smartphone,
  Clock,
  Sunset,
  Star,
  Sparkles,
  AlertTriangle,
  User,
  Calendar,
  Target,
  Zap,
  CheckCircle2,
  Rocket,
  Feather,
  MessageCircle,
} from 'lucide-react'
import { saveUserProfile, earnBadge, recordDailyActivity } from '../utils/dbHelpers'

// ═══ تایپ‌ها ═══

interface Option {
  value: string
  label: string
  icon: ReactNode
  description?: string
}

interface OnboardingProps {
  onComplete: () => void
}

interface FormData {
  name: string
  age: string
  status: string
  goals: string[]
  sleepTime: string
  focusLevel: string
  screenTime: string
  communicationStyle: string
}

// ═══ گزینه‌ها ═══

const STATUS_OPTIONS: Option[] = [
  { value: 'highschool', label: 'دانش‌آموز',  icon: <BookOpen size={22} /> },
  { value: 'student',    label: 'دانشجو',     icon: <GraduationCap size={22} /> },
  { value: 'employed',   label: 'شاغل',       icon: <Briefcase size={22} /> },
  { value: 'freelancer', label: 'فریلنسر',    icon: <Laptop size={22} /> },
  { value: 'jobseeker',  label: 'جویای کار',  icon: <Search size={22} /> },
  { value: 'other',      label: 'سایر',       icon: <Pin size={22} /> },
]

const GOAL_OPTIONS: Option[] = [
  { value: 'routine', label: 'ساختن روتین روزانه',    icon: <Sunrise size={22} /> },
  { value: 'purpose', label: 'پیدا کردن هدف و مسیر',  icon: <Compass size={22} /> },
  { value: 'focus',   label: 'بهبود تمرکز',            icon: <Brain size={22} /> },
  { value: 'sleep',   label: 'خواب بهتر',              icon: <Moon size={22} /> },
  { value: 'skills',  label: 'یادگیری مهارت جدید',     icon: <BookOpen size={22} /> },
  { value: 'mental',  label: 'سلامت روان',             icon: <Heart size={22} /> },
  { value: 'screen',  label: 'کاهش اسکرین تایم',      icon: <Smartphone size={22} /> },
  { value: 'time',    label: 'مدیریت زمان',            icon: <Clock size={22} /> },
]

const SLEEP_OPTIONS: Option[] = [
  { value: 'before-22', label: 'قبل ۱۰ شب',    icon: <Sunrise size={22} /> },
  { value: '22-23',     label: '۱۰ تا ۱۱ شب',  icon: <Sunset size={22} /> },
  { value: '23-00',     label: '۱۱ تا ۱۲ شب',  icon: <Moon size={22} /> },
  { value: '00-01',     label: '۱۲ تا ۱ شب',   icon: <Star size={22} /> },
  { value: 'after-01',  label: 'بعد از ۱ شب',   icon: <Sparkles size={22} /> },
]

const FOCUS_OPTIONS: Option[] = [
  { value: 'great',     label: 'عالی',        icon: <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#22c55e' }} />, description: 'تمرکزم خوبه' },
  { value: 'medium',    label: 'متوسط',       icon: <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#eab308' }} />, description: 'بعضی وقتا حواسم پرت میشه' },
  { value: 'weak',      label: 'ضعیف',        icon: <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#f97316' }} />, description: 'زیاد حواسم پرت میشه' },
  { value: 'very-weak', label: 'خیلی ضعیف',   icon: <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#ef4444' }} />, description: 'اصلاً نمیتونم تمرکز کنم' },
]

const SCREEN_OPTIONS: Option[] = [
  { value: 'under-2', label: 'کمتر از ۲ ساعت',   icon: <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#22c55e' }} /> },
  { value: '2-4',     label: '۲ تا ۴ ساعت',      icon: <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#eab308' }} /> },
  { value: '4-6',     label: '۴ تا ۶ ساعت',      icon: <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#f97316' }} /> },
  { value: '6-8',     label: '۶ تا ۸ ساعت',      icon: <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#ef4444' }} /> },
  { value: 'over-8',  label: 'بیشتر از ۸ ساعت',  icon: <AlertTriangle size={20} style={{ color: '#ef4444' }} /> },
]

const COMMUNICATION_OPTIONS: Option[] = [
  {
    value: 'direct',
    label: 'مستقیم و محکم',
    icon: <Zap size={22} style={{ color: '#f59e0b' }} />,
    description: 'رک و بدون تعارف بگو چیکار کنم',
  },
  {
    value: 'gradual',
    label: 'مرحله‌ای و آرام',
    icon: <Feather size={22} style={{ color: '#3b82f6' }} />,
    description: 'قدم به قدم و با آرامش راهنماییم کن',
  },
  {
    value: 'mixed',
    label: 'ترکیبی',
    icon: <Sparkles size={22} style={{ color: '#8b5cf6' }} />,
    description: 'بسته به شرایط، هر دو سبک',
  },
]

const TOTAL_STEPS = 10

// ═══ کامپوننت اصلی ═══

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState<FormData>({
    name: '', age: '', status: '', goals: [],
    sleepTime: '', focusLevel: '', screenTime: '',
    communicationStyle: '',
  })

  const isStepValid = (): boolean => {
    switch (step) {
      case 0: return true
      case 1: return data.name.trim().length >= 2
      case 2: { const age = parseInt(data.age); return !isNaN(age) && age >= 14 && age <= 45 }
      case 3: return data.status !== ''
      case 4: return data.goals.length > 0
      case 5: return data.sleepTime !== ''
      case 6: return data.focusLevel !== ''
      case 7: return data.screenTime !== ''
      case 8: return data.communicationStyle !== ''
      case 9: return true
      default: return false
    }
  }

  const goNext = () => { if (step < TOTAL_STEPS - 1 && isStepValid()) setStep(s => s + 1) }
  const goBack = () => { if (step > 0) setStep(s => s - 1) }

  const handleSingleSelect = (field: keyof FormData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
    setTimeout(() => setStep(s => s + 1), 400)
  }

  const toggleGoal = (value: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(value)
        ? prev.goals.filter(g => g !== value)
        : [...prev.goals, value],
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await saveUserProfile({
        name: data.name.trim(),
        age: parseInt(data.age),
        status: data.status,
        goals: data.goals,
        sleepTime: data.sleepTime,
        wakeTime: '',
        focusLevel: data.focusLevel,
        screenTime: data.screenTime,
        motivation: '',
        communicationStyle: (data.communicationStyle || 'mixed') as 'direct' | 'gradual' | 'mixed',
      })
      await earnBadge('first_step')
      await recordDailyActivity()
      onComplete()
    } catch (error) {
      console.error('خطا در ذخیره:', error)
      alert('مشکلی پیش اومد. دوباره تلاش کن.')
      setIsSubmitting(false)
    }
  }

  const progressPercent = (step / (TOTAL_STEPS - 1)) * 100

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>

      {/* نوار بالا */}
      {step > 0 && step < TOTAL_STEPS - 1 && (
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-4">
            <button onClick={goBack} className="p-2 rounded-xl transition-all active:scale-90" style={{ color: 'var(--color-text-secondary)' }}>
              <ArrowRight size={24} />
            </button>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
              <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ backgroundColor: 'var(--color-accent)', width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs font-medium min-w-[32px] text-center" style={{ color: 'var(--color-text-secondary)' }}>
              {step}/{TOTAL_STEPS - 2}
            </span>
          </div>
        </div>
      )}

      {/* محتوا */}
      <div className="flex-1 px-6 py-6 pb-28 overflow-y-auto">
        {step === 0 && renderWelcome()}
        {step === 1 && renderName()}
        {step === 2 && renderAge()}
        {step === 3 && renderOptions('الان چیکار میکنی؟', 'وضعیت فعلیت رو انتخاب کن', <Briefcase size={28} />, STATUS_OPTIONS, 'status')}
        {step === 4 && renderGoals()}
        {step === 5 && renderOptions('معمولاً کی میخوابی؟', 'ساعت تقریبی خوابت', <Moon size={28} />, SLEEP_OPTIONS, 'sleepTime')}
        {step === 6 && renderFocusScreen('تمرکزت چطوره؟', 'صادقانه بگو — قضاوتی نیست', <Brain size={28} />, FOCUS_OPTIONS, 'focusLevel')}
        {step === 7 && renderFocusScreen('روزی چقدر گوشی دستته؟', 'میانگین زمان روزانه', <Smartphone size={28} />, SCREEN_OPTIONS, 'screenTime')}
        {step === 8 && renderFocusScreen('MODO چطوری باهات حرف بزنه؟', 'این فقط شدت بیان رو تنظیم میکنه، شخصیت ثابت میمونه', <MessageCircle size={28} />, COMMUNICATION_OPTIONS, 'communicationStyle')}
        {step === 9 && renderSummary()}
      </div>

      {/* دکمه پایین */}
      {(step === 0 || step === 1 || step === 2 || step === 4 || step === TOTAL_STEPS - 1) && (
        <div className="fixed bottom-0 left-0 right-0 p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
          <button
            onClick={step === TOTAL_STEPS - 1 ? handleSubmit : goNext}
            disabled={!isStepValid() || isSubmitting}
            className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              backgroundColor: isStepValid() ? 'var(--color-accent)' : 'var(--color-border)',
              color: isStepValid() ? '#FFFFFF' : 'var(--color-text-secondary)',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {step === 0 ? (
              <><Sparkles size={20} /><span>بزن بریم</span></>
            ) : step === TOTAL_STEPS - 1 ? (
              isSubmitting ? <span>در حال ذخیره...</span> : <><Rocket size={20} /><span>شروع MODO</span></>
            ) : (
              <span>بعدی</span>
            )}
          </button>
        </div>
      )}
    </div>
  )

  // ═══ رندر مراحل ═══

  function renderWelcome() {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 modo-btn-primary animate-breathe" style={{ fontSize: '2rem', fontWeight: 900 }}>
          M
        </div>
        <div className="text-5xl font-black mb-4 tracking-tight modo-gradient-text">MODO</div>
        <p className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>ساختار، وضوح، رشد</p>
        <p className="text-base leading-8 max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>
          MODO یه کوچ هوشمنده که کمکت میکنه<br />
          به زندگیت نظم بدی و به اهدافت برسی.<br /><br />
          بیا اول یه‌کم بشناسمت.
        </p>
      </div>
    )
  }

  function renderName() {
    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent-glow)' }}>
            <User size={22} style={{ color: 'var(--color-accent)' }} />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>اسمت چیه؟</h2>
        </div>
        <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>می‌خوام بدونم چی صدات کنم</p>
        <input
          type="text"
          value={data.name}
          onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
          onKeyDown={(e) => { if (e.key === 'Enter' && isStepValid()) goNext() }}
          placeholder="اسمت رو بنویس..."
          className="w-full p-4 rounded-2xl text-lg outline-none transition-all duration-200"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            border: `2px solid ${data.name.trim().length >= 2 ? 'var(--color-accent)' : 'var(--color-border)'}`,
          }}
          autoFocus
        />
      </div>
    )
  }

  function renderAge() {
    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent-glow)' }}>
            <Calendar size={22} style={{ color: 'var(--color-accent)' }} />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>چند سالته؟</h2>
        </div>
        <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>برای شخصی‌سازی تجربه‌ات لازمه</p>
        <input
          type="number"
          inputMode="numeric"
          min={14} max={45}
          value={data.age}
          onChange={(e) => setData(prev => ({ ...prev, age: e.target.value }))}
          onKeyDown={(e) => { if (e.key === 'Enter' && isStepValid()) goNext() }}
          placeholder="مثلاً ۲۲"
          className="w-full p-4 rounded-2xl text-2xl text-center outline-none transition-all duration-200"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            border: `2px solid ${isStepValid() ? 'var(--color-accent)' : 'var(--color-border)'}`,
          }}
          autoFocus
        />
        <p className="text-center text-sm mt-3" style={{ color: 'var(--color-text-secondary)' }}>۱۴ تا ۴۵ سال</p>
      </div>
    )
  }

  function renderOptions(title: string, subtitle: string, headerIcon: ReactNode, options: Option[], field: keyof FormData) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent-glow)', color: 'var(--color-accent)' }}>
            {headerIcon}
          </div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{title}</h2>
        </div>
        <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>{subtitle}</p>
        <div className="grid gap-3">
          {options.map((option) => {
            const isSelected = data[field] === option.value
            return (
              <button
                key={option.value}
                onClick={() => handleSingleSelect(field, option.value)}
                className="w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 active:scale-[0.97]"
                style={{
                  backgroundColor: isSelected ? 'var(--color-accent-light)' : 'var(--color-bg-secondary)',
                  border: `2px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                }}
              >
                <div style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}>
                  {option.icon}
                </div>
                <span className="font-medium" style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>
                  {option.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  function renderGoals() {
    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent-glow)', color: 'var(--color-accent)' }}>
            <Target size={22} />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>دنبال چی هستی؟</h2>
        </div>
        <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>یک یا چند مورد انتخاب کن</p>
        <div className="grid gap-3">
          {GOAL_OPTIONS.map((option) => {
            const isSelected = data.goals.includes(option.value)
            return (
              <button
                key={option.value}
                onClick={() => toggleGoal(option.value)}
                className="w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 active:scale-[0.97]"
                style={{
                  backgroundColor: isSelected ? 'var(--color-accent-light)' : 'var(--color-bg-secondary)',
                  border: `2px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                }}
              >
                <div style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}>
                  {option.icon}
                </div>
                <span className="font-medium text-right" style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>
                  {option.label}
                </span>
                {isSelected && (
                  <CheckCircle2 size={18} className="mr-auto" style={{ color: 'var(--color-accent)' }} />
                )}
              </button>
            )
          })}
        </div>
        {data.goals.length > 0 && (
          <p className="text-center text-sm mt-4" style={{ color: 'var(--color-accent)' }}>
            {data.goals.length} مورد انتخاب شده
          </p>
        )}
      </div>
    )
  }

  function renderFocusScreen(title: string, subtitle: string, headerIcon: ReactNode, options: Option[], field: keyof FormData) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent-glow)', color: 'var(--color-accent)' }}>
            {headerIcon}
          </div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{title}</h2>
        </div>
        <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>{subtitle}</p>
        <div className="grid gap-3">
          {options.map((option) => {
            const isSelected = data[field] === option.value
            return (
              <button
                key={option.value}
                onClick={() => handleSingleSelect(field, option.value)}
                className="w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 active:scale-[0.97]"
                style={{
                  backgroundColor: isSelected ? 'var(--color-accent-light)' : 'var(--color-bg-secondary)',
                  border: `2px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                }}
              >
                {option.icon}
                <div className="text-right">
                  <span className="font-medium block" style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{option.description}</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  function renderSummary() {
    const statusOption = STATUS_OPTIONS.find(o => o.value === data.status)
    const sleepLabel = SLEEP_OPTIONS.find(o => o.value === data.sleepTime)?.label || ''
    const focusLabel = FOCUS_OPTIONS.find(o => o.value === data.focusLevel)?.label || ''
    const screenLabel = SCREEN_OPTIONS.find(o => o.value === data.screenTime)?.label || ''
    const commLabel = COMMUNICATION_OPTIONS.find(o => o.value === data.communicationStyle)?.label || 'ترکیبی'
    const goalLabels = data.goals.map(g => GOAL_OPTIONS.find(o => o.value === g))

    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent-glow)', color: 'var(--color-accent)' }}>
            <CheckCircle2 size={22} />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>خلاصه پروفایلت</h2>
        </div>
        <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>همه‌چیز درسته؟</p>

        <div className="rounded-2xl p-5 space-y-5" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
          {/* اسم و سن */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent-glow)' }}>
              <User size={20} style={{ color: 'var(--color-accent)' }} />
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>{data.name}</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {data.age} ساله — {statusOption?.label}
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)' }} />

          {/* اهداف */}
          <div>
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>اهداف:</p>
            <div className="flex flex-wrap gap-2">
              {goalLabels.map((goal) => goal && (
                <span
                  key={goal.value}
                  className="px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5"
                  style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}
                >
                  {goal.icon}
                  {goal.label}
                </span>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)' }} />

          {/* عادت‌ها و تنظیمات */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                <Moon size={16} /> ساعت خواب
              </span>
              <span style={{ color: 'var(--color-text-primary)' }}>{sleepLabel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                <Brain size={16} /> تمرکز
              </span>
              <span style={{ color: 'var(--color-text-primary)' }}>{focusLabel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                <Smartphone size={16} /> اسکرین تایم
              </span>
              <span style={{ color: 'var(--color-text-primary)' }}>{screenLabel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                <MessageCircle size={16} /> سبک ارتباط
              </span>
              <span style={{ color: 'var(--color-text-primary)' }}>{commLabel}</span>
            </div>
          </div>
        </div>

        {/* پیام MODO */}
        <div
          className="rounded-2xl p-4 mt-4 text-center flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--color-accent-light)', border: '1px solid var(--color-accent)' }}
        >
          <Zap size={18} style={{ color: 'var(--color-accent)' }} />
          <p className="font-medium" style={{ color: 'var(--color-accent)' }}>
            {data.name} عزیز، آماده‌ام کمکت کنم
          </p>
        </div>
      </div>
    )
  }
}
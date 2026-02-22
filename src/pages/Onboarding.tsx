// src/pages/Onboarding.tsx
// ─────────────────────────────────────
// صفحه آنبوردینگ: اولین تجربه کاربر با MODO
// شامل ۹ مرحله (۰ تا ۸)
// ─────────────────────────────────────

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { saveUserProfile, earnBadge, recordDailyActivity } from '../utils/dbHelpers'

// ═══════════════════════════════════════
// تایپ‌ها
// ═══════════════════════════════════════

// شکل هر گزینه (مثلاً "دانشجو" یا "شاغل")
interface Option {
  value: string
  label: string
  icon: string
  description?: string
}

// Props: چه چیزی از بیرون بهش داده میشه
interface OnboardingProps {
  onComplete: () => void  // وقتی آنبوردینگ تموم شد، این تابع صدا زده میشه
}

// شکل داده‌های فرم
interface FormData {
  name: string
  age: string
  status: string
  goals: string[]
  sleepTime: string
  focusLevel: string
  screenTime: string
}

// ═══════════════════════════════════════
// گزینه‌های سوالات
// ═══════════════════════════════════════

const STATUS_OPTIONS: Option[] = [
  { value: 'highschool', label: 'دانش‌آموز', icon: '📚' },
  { value: 'student',    label: 'دانشجو', icon: '🎓' },
  { value: 'employed',   label: 'شاغل', icon: '💼' },
  { value: 'freelancer', label: 'فریلنسر', icon: '💻' },
  { value: 'jobseeker',  label: 'جویای کار', icon: '🔍' },
  { value: 'other',      label: 'سایر', icon: '📌' },
]

const GOAL_OPTIONS: Option[] = [
  { value: 'routine',  label: 'ساختن روتین روزانه', icon: '🌅' },
  { value: 'purpose',  label: 'پیدا کردن هدف و مسیر', icon: '🧭' },
  { value: 'focus',    label: 'بهبود تمرکز', icon: '🧠' },
  { value: 'sleep',    label: 'خواب بهتر', icon: '😴' },
  { value: 'skills',   label: 'یادگیری مهارت جدید', icon: '📖' },
  { value: 'mental',   label: 'سلامت روان', icon: '💚' },
  { value: 'screen',   label: 'کاهش اسکرین تایم', icon: '📵' },
  { value: 'time',     label: 'مدیریت زمان', icon: '⏰' },
]

const SLEEP_OPTIONS: Option[] = [
  { value: 'before-22', label: 'قبل ۱۰ شب', icon: '🌅' },
  { value: '22-23',     label: '۱۰ تا ۱۱ شب', icon: '🌆' },
  { value: '23-00',     label: '۱۱ تا ۱۲ شب', icon: '🌙' },
  { value: '00-01',     label: '۱۲ تا ۱ شب', icon: '🌑' },
  { value: 'after-01',  label: 'بعد از ۱ شب', icon: '💫' },
]

const FOCUS_OPTIONS: Option[] = [
  { value: 'great',     label: 'عالی', icon: '🟢', description: 'تمرکزم خوبه' },
  { value: 'medium',    label: 'متوسط', icon: '🟡', description: 'بعضی وقتا حواسم پرت میشه' },
  { value: 'weak',      label: 'ضعیف', icon: '🟠', description: 'زیاد حواسم پرت میشه' },
  { value: 'very-weak', label: 'خیلی ضعیف', icon: '🔴', description: 'اصلاً نمیتونم تمرکز کنم' },
]

const SCREEN_OPTIONS: Option[] = [
  { value: 'under-2', label: 'کمتر از ۲ ساعت', icon: '🟢' },
  { value: '2-4',     label: '۲ تا ۴ ساعت', icon: '🟡' },
  { value: '4-6',     label: '۴ تا ۶ ساعت', icon: '🟠' },
  { value: '6-8',     label: '۶ تا ۸ ساعت', icon: '🔴' },
  { value: 'over-8',  label: 'بیشتر از ۸ ساعت', icon: '💀' },
]

// ═══════════════════════════════════════
// تعداد کل مراحل
// ═══════════════════════════════════════
const TOTAL_STEPS = 9  // مراحل ۰ تا ۸

// ═══════════════════════════════════════
// کامپوننت اصلی
// ═══════════════════════════════════════

export default function Onboarding({ onComplete }: OnboardingProps) {

  // ─── State ها ───
  const [step, setStep] = useState(0)           // مرحله فعلی
  const [isSubmitting, setIsSubmitting] = useState(false)  // آیا در حال ذخیره‌ست؟
  const [data, setData] = useState<FormData>({   // داده‌های فرم
    name: '',
    age: '',
    status: '',
    goals: [],
    sleepTime: '',
    focusLevel: '',
    screenTime: '',
  })

  // ─── بررسی اعتبار مرحله فعلی ───
  // آیا کاربر اطلاعات لازم این مرحله رو پر کرده؟
  const isStepValid = (): boolean => {
    switch (step) {
      case 0: return true  // خوش‌آمدگویی - همیشه معتبره
      case 1: return data.name.trim().length >= 2  // حداقل ۲ حرف
      case 2: {
        const age = parseInt(data.age)
        return !isNaN(age) && age >= 14 && age <= 45
      }
      case 3: return data.status !== ''
      case 4: return data.goals.length > 0  // حداقل یه هدف
      case 5: return data.sleepTime !== ''
      case 6: return data.focusLevel !== ''
      case 7: return data.screenTime !== ''
      case 8: return true  // خلاصه - همیشه معتبره
      default: return false
    }
  }

  // ─── رفتن به مرحله بعد ───
  const goNext = () => {
    if (step < TOTAL_STEPS - 1 && isStepValid()) {
      setStep(s => s + 1)
    }
  }

  // ─── برگشتن به مرحله قبل ───
  const goBack = () => {
    if (step > 0) setStep(s => s - 1)
  }

  // ─── انتخاب گزینه تکی (مثل وضعیت، خواب) ───
  // بعد از انتخاب، خودکار بره مرحله بعد
  const handleSingleSelect = (field: keyof FormData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
    // ۴۰۰ میلی‌ثانیه صبر کن تا کاربر انتخابش رو ببینه، بعد برو بعدی
    setTimeout(() => {
      setStep(s => s + 1)
    }, 400)
  }

  // ─── تغییر انتخاب هدف (چندتایی) ───
  const toggleGoal = (value: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(value)
        ? prev.goals.filter(g => g !== value)  // حذف اگه قبلاً انتخاب شده
        : [...prev.goals, value]                // اضافه اگه انتخاب نشده
    }))
  }

  // ─── ثبت نهایی و ذخیره در دیتابیس ───
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // ذخیره پروفایل
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
      })

      // نشان "اولین قدم" رو بده
      await earnBadge('first_step')

      // فعالیت امروز رو ثبت کن
      await recordDailyActivity()

      // تمام! برو به اپ اصلی
      onComplete()
    } catch (error) {
      console.error('خطا در ذخیره:', error)
      alert('مشکلی پیش اومد. دوباره تلاش کن.')
      setIsSubmitting(false)
    }
  }

  // ─── درصد پیشرفت ───
  const progressPercent = (step / (TOTAL_STEPS - 1)) * 100

  // ═══════════════════════════════════════
  // رندر صفحه
  // ═══════════════════════════════════════

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >

      {/* ─── نوار بالا: دکمه برگشت + نوار پیشرفت ─── */}
      {step > 0 && step < TOTAL_STEPS - 1 && (
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-4">
            {/* دکمه برگشت */}
            <button
              onClick={goBack}
              className="p-2 rounded-xl transition-all active:scale-90"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <ArrowRight size={24} />
            </button>

            {/* نوار پیشرفت */}
            <div
              className="flex-1 h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  width: `${progressPercent}%`,
                }}
              />
            </div>

            {/* شماره مرحله */}
            <span
              className="text-xs font-medium min-w-[32px] text-center"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {step}/{TOTAL_STEPS - 2}
            </span>
          </div>
        </div>
      )}

      {/* ─── محتوای مرحله ─── */}
      <div className="flex-1 px-6 py-6 pb-28 overflow-y-auto">
        {step === 0 && renderWelcome()}
        {step === 1 && renderName()}
        {step === 2 && renderAge()}
        {step === 3 && renderStatus()}
        {step === 4 && renderGoals()}
        {step === 5 && renderSleep()}
        {step === 6 && renderFocus()}
        {step === 7 && renderScreen()}
        {step === 8 && renderSummary()}
      </div>

      {/* ─── دکمه پایین ─── */}
      {/* فقط برای مراحلی که auto-advance ندارن نشون بده */}
      {(step === 0 || step === 1 || step === 2 || step === 4 || step === TOTAL_STEPS - 1) && (
        <div
          className="fixed bottom-0 left-0 right-0 p-6"
          style={{ backgroundColor: 'var(--color-bg-primary)' }}
        >
          <button
            onClick={step === TOTAL_STEPS - 1 ? handleSubmit : goNext}
            disabled={!isStepValid() || isSubmitting}
            className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 active:scale-[0.98]"
            style={{
              backgroundColor: isStepValid()
                ? 'var(--color-accent)'
                : 'var(--color-border)',
              color: isStepValid() ? '#FFFFFF' : 'var(--color-text-secondary)',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {step === 0
              ? '✨ بزن بریم'
              : step === TOTAL_STEPS - 1
                ? isSubmitting ? 'در حال ذخیره...' : '🚀 شروع MODO'
                : 'بعدی'
            }
          </button>
        </div>
      )}
    </div>
  )

  // ═══════════════════════════════════════
  // توابع رندر هر مرحله
  // ═══════════════════════════════════════

  // ─── مرحله ۰: خوش‌آمدگویی ───
  function renderWelcome() {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        {/* لوگو */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 modo-btn-primary animate-breathe"
          style={{ fontSize: '2rem', fontWeight: 900 }}
        >
          M
        </div>

        <div
          className="text-5xl font-black mb-4 tracking-tight modo-gradient-text"
        >
          MODO
        </div>

        <p
          className="text-lg font-bold mb-4"
          style={{ color: 'var(--color-text-primary)' }}
        >
          ساختار، وضوح، رشد
        </p>

        <p
          className="text-base leading-8 max-w-xs"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          MODO یه کوچ هوشمنده که کمکت میکنه
          <br />
          به زندگیت نظم بدی و به اهدافت برسی.
          <br />
          <br />
          بیا اول یه‌کم بشناسمت.
        </p>
      </div>
    )
  }

  // ─── مرحله ۱: اسم ───
  function renderName() {
    return (
      <div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          اسمت چیه؟ 👋
        </h2>
        <p
          className="mb-8"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          می‌خوام بدونم چی صدات کنم
        </p>

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

  // ─── مرحله ۲: سن ───
  function renderAge() {
    return (
      <div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          چند سالته؟ 🎂
        </h2>
        <p
          className="mb-8"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          برای شخصی‌سازی تجربه‌ات لازمه
        </p>

        <input
          type="number"
          inputMode="numeric"
          min={14}
          max={45}
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

        {/* راهنما */}
        <p
          className="text-center text-sm mt-3"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          ۱۴ تا ۴۵ سال
        </p>
      </div>
    )
  }

  // ─── مرحله ۳: وضعیت ───
  function renderStatus() {
    return (
      <div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          الان چیکار میکنی؟ 🎯
        </h2>
        <p
          className="mb-8"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          وضعیت فعلیت رو انتخاب کن
        </p>

        <div className="grid gap-3">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSingleSelect('status', option.value)}
              className="w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 active:scale-[0.97]"
              style={{
                backgroundColor: data.status === option.value
                  ? 'var(--color-accent-light)'
                  : 'var(--color-bg-secondary)',
                border: `2px solid ${data.status === option.value
                  ? 'var(--color-accent)'
                  : 'var(--color-border)'}`,
              }}
            >
              <span className="text-2xl">{option.icon}</span>
              <span
                className="font-medium"
                style={{
                  color: data.status === option.value
                    ? 'var(--color-accent)'
                    : 'var(--color-text-primary)',
                }}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ─── مرحله ۴: اهداف (انتخاب چندتایی) ───
  function renderGoals() {
    return (
      <div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          دنبال چی هستی؟ ✨
        </h2>
        <p
          className="mb-8"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          یک یا چند مورد انتخاب کن
        </p>

        <div className="grid gap-3">
          {GOAL_OPTIONS.map((option) => {
            const isSelected = data.goals.includes(option.value)
            return (
              <button
                key={option.value}
                onClick={() => toggleGoal(option.value)}
                className="w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 active:scale-[0.97]"
                style={{
                  backgroundColor: isSelected
                    ? 'var(--color-accent-light)'
                    : 'var(--color-bg-secondary)',
                  border: `2px solid ${isSelected
                    ? 'var(--color-accent)'
                    : 'var(--color-border)'}`,
                }}
              >
                <span className="text-2xl">{option.icon}</span>
                <span
                  className="font-medium text-right"
                  style={{
                    color: isSelected
                      ? 'var(--color-accent)'
                      : 'var(--color-text-primary)',
                  }}
                >
                  {option.label}
                </span>

                {/* علامت تیک وقتی انتخاب شده */}
                {isSelected && (
                  <span
                    className="mr-auto text-sm"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* تعداد انتخاب شده */}
        {data.goals.length > 0 && (
          <p
            className="text-center text-sm mt-4"
            style={{ color: 'var(--color-accent)' }}
          >
            {data.goals.length} مورد انتخاب شده
          </p>
        )}
      </div>
    )
  }

  // ─── مرحله ۵: ساعت خواب ───
  function renderSleep() {
    return (
      <div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          معمولاً کی میخوابی؟ 🌙
        </h2>
        <p
          className="mb-8"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          ساعت تقریبی خوابت
        </p>

        <div className="grid gap-3">
          {SLEEP_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSingleSelect('sleepTime', option.value)}
              className="w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 active:scale-[0.97]"
              style={{
                backgroundColor: data.sleepTime === option.value
                  ? 'var(--color-accent-light)'
                  : 'var(--color-bg-secondary)',
                border: `2px solid ${data.sleepTime === option.value
                  ? 'var(--color-accent)'
                  : 'var(--color-border)'}`,
              }}
            >
              <span className="text-2xl">{option.icon}</span>
              <span
                className="font-medium"
                style={{
                  color: data.sleepTime === option.value
                    ? 'var(--color-accent)'
                    : 'var(--color-text-primary)',
                }}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ─── مرحله ۶: سطح تمرکز ───
  function renderFocus() {
    return (
      <div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          تمرکزت چطوره؟ 🧠
        </h2>
        <p
          className="mb-8"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          صادقانه بگو - قضاوتی نیست
        </p>

        <div className="grid gap-3">
          {FOCUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSingleSelect('focusLevel', option.value)}
              className="w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 active:scale-[0.97]"
              style={{
                backgroundColor: data.focusLevel === option.value
                  ? 'var(--color-accent-light)'
                  : 'var(--color-bg-secondary)',
                border: `2px solid ${data.focusLevel === option.value
                  ? 'var(--color-accent)'
                  : 'var(--color-border)'}`,
              }}
            >
              <span className="text-2xl">{option.icon}</span>
              <div className="text-right">
                <span
                  className="font-medium block"
                  style={{
                    color: data.focusLevel === option.value
                      ? 'var(--color-accent)'
                      : 'var(--color-text-primary)',
                  }}
                >
                  {option.label}
                </span>
                {option.description && (
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {option.description}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ─── مرحله ۷: اسکرین تایم ───
  function renderScreen() {
    return (
      <div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          روزی چقدر گوشی دستته؟ 📱
        </h2>
        <p
          className="mb-8"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          میانگین زمان روزانه
        </p>

        <div className="grid gap-3">
          {SCREEN_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSingleSelect('screenTime', option.value)}
              className="w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 active:scale-[0.97]"
              style={{
                backgroundColor: data.screenTime === option.value
                  ? 'var(--color-accent-light)'
                  : 'var(--color-bg-secondary)',
                border: `2px solid ${data.screenTime === option.value
                  ? 'var(--color-accent)'
                  : 'var(--color-border)'}`,
              }}
            >
              <span className="text-2xl">{option.icon}</span>
              <span
                className="font-medium"
                style={{
                  color: data.screenTime === option.value
                    ? 'var(--color-accent)'
                    : 'var(--color-text-primary)',
                }}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ─── مرحله ۸: خلاصه پروفایل ───
  function renderSummary() {
    // تبدیل value ها به label فارسی برای نمایش
    const statusLabel = STATUS_OPTIONS.find(o => o.value === data.status)?.label || ''
    const statusIcon = STATUS_OPTIONS.find(o => o.value === data.status)?.icon || ''
    const sleepLabel = SLEEP_OPTIONS.find(o => o.value === data.sleepTime)?.label || ''
    const focusLabel = FOCUS_OPTIONS.find(o => o.value === data.focusLevel)?.label || ''
    const screenLabel = SCREEN_OPTIONS.find(o => o.value === data.screenTime)?.label || ''
    const goalLabels = data.goals.map(
      g => GOAL_OPTIONS.find(o => o.value === g)
    )

    return (
      <div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          خلاصه پروفایلت 🎉
        </h2>
        <p
          className="mb-8"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          همه‌چیز درسته؟
        </p>

        {/* کارت خلاصه */}
        <div
          className="rounded-2xl p-5 space-y-5"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          {/* اسم و سن */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">👤</span>
            <div>
              <p
                className="font-bold text-lg"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {data.name}
              </p>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {data.age} ساله • {statusIcon} {statusLabel}
              </p>
            </div>
          </div>

          {/* خط جداکننده */}
          <div style={{ borderTop: '1px solid var(--color-border)' }} />

          {/* اهداف */}
          <div>
            <p
              className="text-sm mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              اهداف:
            </p>
            <div className="flex flex-wrap gap-2">
              {goalLabels.map((goal) => goal && (
                <span
                  key={goal.value}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    backgroundColor: 'var(--color-accent-light)',
                    color: 'var(--color-accent)',
                  }}
                >
                  {goal.icon} {goal.label}
                </span>
              ))}
            </div>
          </div>

          {/* خط جداکننده */}
          <div style={{ borderTop: '1px solid var(--color-border)' }} />

          {/* عادت‌ها */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-text-secondary)' }}>🌙 ساعت خواب</span>
              <span style={{ color: 'var(--color-text-primary)' }}>{sleepLabel}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-text-secondary)' }}>🧠 تمرکز</span>
              <span style={{ color: 'var(--color-text-primary)' }}>{focusLabel}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-text-secondary)' }}>📱 اسکرین تایم</span>
              <span style={{ color: 'var(--color-text-primary)' }}>{screenLabel}</span>
            </div>
          </div>
        </div>

        {/* پیام MODO */}
        <div
          className="rounded-2xl p-4 mt-4 text-center"
          style={{
            backgroundColor: 'var(--color-accent-light)',
            border: '1px solid var(--color-accent)',
          }}
        >
          <p
            className="font-medium"
            style={{ color: 'var(--color-accent)' }}
          >
            {data.name} عزیز، آماده‌ام کمکت کنم! 💪
          </p>
        </div>
      </div>
    )
  }
}
// src/pages/Settings.tsx
// ─────────────────────────────────────
// صفحه تنظیمات MODO
// ─────────────────────────────────────

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sun,
  Moon,
  RotateCcw,
  AlertTriangle,
  Info,
  ChevronLeft,
  User,
  MessageCircle,
  X,
} from 'lucide-react'
import { useThemeStore } from '../store/useThemeStore'
import {
  getUserProfile,
  clearChatHistory,
  resetAllData,
} from '../utils/dbHelpers'
import type { UserProfile } from '../utils/db'

export default function Settings() {
  const { isDark, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  const [profile, setProfile] = useState<UserProfile | undefined>()
  const [showAbout, setShowAbout] = useState(false)
  const [loading, setLoading] = useState(true)

  // لود پروفایل
  useEffect(() => {
    async function load() {
      const p = await getUserProfile()
      setProfile(p)
      setLoading(false)
    }
    load()
  }, [])

  // ─── پاک کردن چت ───
  const handleClearChat = async () => {
    if (!window.confirm('مطمئنی میخوای تمام تاریخچه چت رو پاک کنی؟')) return
    await clearChatHistory()
    alert('✅ تاریخچه چت پاک شد')
  }

  // ─── آنبوردینگ مجدد ───
  const handleRedoOnboarding = () => {
    if (!window.confirm('با این کار پروفایلت پاک میشه و از اول شروع میکنی. مطمئنی؟')) return
    resetAllData().then(() => {
      window.location.reload()
    })
  }

  // ─── پاک کردن همه داده‌ها ───
  const handleResetAll = () => {
    if (!window.confirm('⚠️ تمام داده‌هات (پروفایل، چت، اهداف، پیشرفت) حذف میشه. مطمئنی؟')) return
    if (!window.confirm('واقعاً مطمئنی؟ این کار برگشت‌ناپذیره!')) return
    resetAllData().then(() => {
      window.location.reload()
    })
  }

  // ─── وضعیت فارسی ───
  const statusLabels: Record<string, string> = {
    highschool: 'دانش‌آموز',
    student: 'دانشجو',
    employed: 'شاغل',
    freelancer: 'فریلنسر',
    jobseeker: 'جویای کار',
    other: 'سایر',
  }

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
    <div className="p-6 space-y-4">
      {/* هدر */}
      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        ⚙️ تنظیمات
      </h1>

      {/* ═══ بخش پروفایل ═══ */}
      {profile && (
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div className="flex items-center gap-4">
            {/* آواتار */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-accent)',
              }}
            >
              <User size={28} color="#FFFFFF" />
            </div>

            {/* اطلاعات */}
            <div>
              <h2
                className="text-lg font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {profile.name}
              </h2>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {profile.age} ساله • {statusLabels[profile.status] || profile.status}
              </p>
            </div>
          </div>

          {/* اهداف انتخابی */}
          {profile.goals.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.goals.map((goal) => (
                <span
                  key={goal}
                  className="px-2 py-1 rounded-lg text-[10px] font-medium"
                  style={{
                    backgroundColor: 'var(--color-accent-light)',
                    color: 'var(--color-accent)',
                  }}
                >
                  {goal}
                </span>
              ))}
            </div>
          )}

          {/* دکمه ویرایش */}
          <button
            onClick={() => navigate('/edit-profile')}
            className="w-full mt-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-accent)',
              border: '1px solid var(--color-border)',
            }}
          >
            ویرایش پروفایل
          </button>
        </div>
      )}

      {/* ═══ بخش ظاهر ═══ */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="px-5 pt-4 pb-2">
          <p
            className="text-xs font-bold"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            ظاهر
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="w-full px-5 py-4 flex items-center justify-between transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon size={20} style={{ color: 'var(--color-accent)' }} />
            ) : (
              <Sun size={20} style={{ color: 'var(--color-accent)' }} />
            )}
            <span
              className="font-medium"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {isDark ? 'حالت تاریک' : 'حالت روشن'}
            </span>
          </div>

          <div
            className="w-12 h-7 rounded-full p-1 transition-all duration-300 flex items-center"
            style={{
              backgroundColor: isDark
                ? 'var(--color-accent)'
                : 'var(--color-border)',
              justifyContent: isDark ? 'flex-start' : 'flex-end',
            }}
          >
            <div className="w-5 h-5 rounded-full bg-white transition-all duration-300" />
          </div>
        </button>
      </div>

      {/* ═══ بخش عملیات ═══ */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="px-5 pt-4 pb-2">
          <p
            className="text-xs font-bold"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            عملیات
          </p>
        </div>

        <button
          onClick={handleRedoOnboarding}
          className="w-full px-5 py-4 flex items-center justify-between transition-all active:scale-[0.98]"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <RotateCcw size={20} style={{ color: 'var(--color-accent)' }} />
            <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
              انجام مجدد آنبوردینگ
            </span>
          </div>
          <ChevronLeft size={18} style={{ color: 'var(--color-text-secondary)' }} />
        </button>

        <button
          onClick={handleClearChat}
          className="w-full px-5 py-4 flex items-center justify-between transition-all active:scale-[0.98]"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <MessageCircle size={20} style={{ color: 'var(--color-warning)' }} />
            <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
              پاک کردن تاریخچه چت
            </span>
          </div>
          <ChevronLeft size={18} style={{ color: 'var(--color-text-secondary)' }} />
        </button>

        <button
          onClick={handleResetAll}
          className="w-full px-5 py-4 flex items-center justify-between transition-all active:scale-[0.98]"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} style={{ color: 'var(--color-danger)' }} />
            <div className="text-right">
              <span className="font-medium block" style={{ color: 'var(--color-danger)' }}>
                پاک کردن تمام داده‌ها
              </span>
              <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
                پروفایل، چت، اهداف، پیشرفت
              </span>
            </div>
          </div>
          <ChevronLeft size={18} style={{ color: 'var(--color-text-secondary)' }} />
        </button>
      </div>

      {/* ═══ بخش درباره ═══ */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
        }}
      >
        <button
          onClick={() => setShowAbout(true)}
          className="w-full px-5 py-4 flex items-center justify-between transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <Info size={20} style={{ color: 'var(--color-accent)' }} />
            <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
              درباره MODO
            </span>
          </div>
          <ChevronLeft size={18} style={{ color: 'var(--color-text-secondary)' }} />
        </button>
      </div>

      <p className="text-center text-xs pt-4" style={{ color: 'var(--color-text-secondary)' }}>
        MODO v1.0.0 • ساخته شده با ❤️
      </p>

      {/* ═══ Modal درباره ═══ */}
      {showAbout && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAbout(false)
          }}
        >
          <div
            className="w-full max-w-md rounded-3xl p-6"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                درباره MODO
              </h2>
              <button
                onClick={() => setShowAbout(false)}
                className="p-2 rounded-xl transition-all active:scale-90"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <X size={22} />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl font-black mb-2" style={{ color: 'var(--color-accent)' }}>
                MODO
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                ساختار، وضوح، رشد
              </p>
            </div>

            <div
              className="rounded-2xl p-4 mb-4"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              <p className="text-sm leading-7" style={{ color: 'var(--color-text-primary)' }}>
                MODO یک کوچ هوشمند شخصیه که با استفاده از هوش مصنوعی بهت کمک میکنه زندگیت رو سازمان‌دهی کنی، اهدافت رو مشخص کنی و هر روز یه قدم به نسخه بهتر خودت نزدیک‌تر بشی.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  نسخه
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  ۱.۰.۰ (MVP)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  موتور هوش مصنوعی
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  Groq (Llama 3.3)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  ذخیره‌سازی
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  محلی (مرورگر)
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAbout(false)}
              className="w-full mt-6 py-3 rounded-2xl font-medium transition-all active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: '#FFFFFF',
              }}
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
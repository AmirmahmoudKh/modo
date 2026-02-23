// src/pages/Settings.tsx
// ─────────────────────────────────────
// تنظیمات — با بخش نوتیفیکیشن
// ─────────────────────────────────────

import { useState, useEffect } from 'react'
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
  Edit3,
  Palette,
  Check,
  SlidersHorizontal,
  Sparkles,
  Bell,
  BellOff,
  Clock,
} from 'lucide-react'
import { useThemeStore } from '../store/useThemeStore'
import type { AccentColor } from '../store/useThemeStore'
import { useNavigate } from 'react-router-dom'
import {
  getUserProfile,
  clearChatHistory,
  resetAllData,
} from '../utils/dbHelpers'
import {
  isNotificationSupported,
  getPermissionStatus,
  requestPermission,
  getNotificationSettings,
  saveNotificationSettings,
  startNotificationScheduler,
  stopNotificationScheduler,
  showNotification,
} from '../utils/notifications'
import type { UserProfile } from '../utils/db'

const ACCENT_COLORS: { id: AccentColor; label: string; value: string }[] = [
  { id: 'emerald', label: 'زمردی', value: '#10B981' },
  { id: 'blue',    label: 'آبی',   value: '#3B82F6' },
  { id: 'purple',  label: 'بنفش',  value: '#8B5CF6' },
  { id: 'rose',    label: 'صورتی', value: '#F43F5E' },
  { id: 'amber',   label: 'طلایی', value: '#F59E0B' },
]

const REMINDER_TIMES = [
  { hour: 7,  minute: 0,  label: '۷ صبح' },
  { hour: 9,  minute: 0,  label: '۹ صبح' },
  { hour: 12, minute: 0,  label: '۱۲ ظهر' },
  { hour: 18, minute: 0,  label: '۶ عصر' },
  { hour: 20, minute: 0,  label: '۸ شب' },
  { hour: 21, minute: 0,  label: '۹ شب' },
  { hour: 22, minute: 0,  label: '۱۰ شب' },
]

export default function Settings() {
  const { isDark, toggleTheme, accentColor, setAccentColor } = useThemeStore()
  const navigate = useNavigate()

  const [profile, setProfile] = useState<UserProfile | undefined>()
  const [showAbout, setShowAbout] = useState(false)
  const [loading, setLoading] = useState(true)

  // نوتیفیکیشن
  const [notifSupported] = useState(isNotificationSupported())
  const [notifEnabled, setNotifEnabled] = useState(false)
  const [notifHour, setNotifHour] = useState(21)
  const [notifMinute, setNotifMinute] = useState(0)
  const [permissionStatus, setPermissionStatus] = useState(getPermissionStatus())

  useEffect(() => {
    async function load() {
      const p = await getUserProfile()
      setProfile(p)

      // لود تنظیمات نوتیف
      const settings = getNotificationSettings()
      setNotifEnabled(settings.enabled)
      setNotifHour(settings.hour)
      setNotifMinute(settings.minute)

      setLoading(false)
    }
    load()
  }, [])

  // ─── تغییر نوتیفیکیشن ───
  const handleToggleNotification = async () => {
    if (!notifSupported) return

    if (!notifEnabled) {
      // فعال کردن → درخواست مجوز
      const granted = await requestPermission()
      setPermissionStatus(getPermissionStatus())

      if (!granted) {
        alert('مجوز نوتیفیکیشن داده نشد. از تنظیمات مرورگر فعالش کن.')
        return
      }

      const newSettings = { enabled: true, hour: notifHour, minute: notifMinute }
      saveNotificationSettings(newSettings)
      setNotifEnabled(true)
      startNotificationScheduler()

      // تست: یه نوتیف نمایشی بفرست
      showNotification('MODO', 'یادآوری‌ها فعال شدن! هر روز بهت یادآوری میکنم.')
    } else {
      // غیرفعال
      const newSettings = { enabled: false, hour: notifHour, minute: notifMinute }
      saveNotificationSettings(newSettings)
      setNotifEnabled(false)
      stopNotificationScheduler()
    }
  }

  // ─── تغییر ساعت ───
  const handleTimeChange = (hour: number, minute: number) => {
    setNotifHour(hour)
    setNotifMinute(minute)
    const newSettings = { enabled: notifEnabled, hour, minute }
    saveNotificationSettings(newSettings)

    if (notifEnabled) {
      startNotificationScheduler()
    }
  }

  const handleClearChat = async () => {
    if (!window.confirm('مطمئنی میخوای تمام تاریخچه چت رو پاک کنی؟')) return
    await clearChatHistory()
    alert('تاریخچه چت پاک شد')
  }

  const handleRedoOnboarding = () => {
    if (!window.confirm('پروفایلت پاک میشه و از اول شروع میکنی. مطمئنی؟')) return
    resetAllData().then(() => window.location.reload())
  }

  const handleResetAll = () => {
    if (!window.confirm('تمام داده‌ها حذف میشه. مطمئنی؟')) return
    if (!window.confirm('واقعاً مطمئنی؟ این کار برگشت‌ناپذیره!')) return
    resetAllData().then(() => window.location.reload())
  }

  const statusLabels: Record<string, string> = {
    highschool: 'دانش‌آموز', student: 'دانشجو', employed: 'شاغل',
    freelancer: 'فریلنسر', jobseeker: 'جویای کار', other: 'سایر',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-accent)' }} />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-5 pb-24">

      {/* هدر */}
      <div className="flex items-center gap-3">
        <SlidersHorizontal size={24} style={{ color: 'var(--color-accent)' }} />
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>تنظیمات</h1>
      </div>

      {/* ═══ پروفایل ═══ */}
      {profile && (
        <div className="modo-card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center modo-btn-primary">
              <User size={26} color="#fff" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{profile.name}</h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {profile.age} ساله — {statusLabels[profile.status]}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/edit-profile')}
            className="w-full mt-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
            style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-accent)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center justify-center gap-2">
              <Edit3 size={16} />
              ویرایش پروفایل
            </div>
          </button>
        </div>
      )}

      {/* ═══ ظاهر ═══ */}
      <div className="modo-card space-y-4">
        {/* تاریک/روشن */}
        <button onClick={toggleTheme} className="w-full flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
            <span>{isDark ? 'حالت تاریک' : 'حالت روشن'}</span>
          </div>
          <div className="w-12 h-6 rounded-full p-1 flex items-center transition-all duration-300" style={{ backgroundColor: isDark ? 'var(--color-accent)' : 'var(--color-border)', justifyContent: isDark ? 'flex-start' : 'flex-end' }}>
            <div className="w-4 h-4 rounded-full bg-white transition-all duration-300" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          </div>
        </button>

        <div className="modo-divider" />

        {/* رنگ تم */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Palette size={18} style={{ color: 'var(--color-accent)' }} />
            <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>رنگ تم</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            {ACCENT_COLORS.map((color) => {
              const isSelected = accentColor === color.id
              return (
                <button key={color.id} onClick={() => setAccentColor(color.id)} className="relative flex flex-col items-center gap-2 transition-all duration-300 active:scale-90" title={color.label}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: color.value,
                      boxShadow: isSelected ? `0 0 0 3px var(--color-bg-secondary), 0 0 0 5px ${color.value}, 0 4px 12px ${color.value}40` : `0 2px 6px ${color.value}30`,
                      transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                    }}
                  >
                    {isSelected && <Check size={16} color="#fff" strokeWidth={3} />}
                  </div>
                  <span className="text-[10px] font-medium transition-colors duration-300" style={{ color: isSelected ? color.value : 'var(--color-text-secondary)' }}>
                    {color.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ═══ نوتیفیکیشن ═══ */}
      <div className="modo-card space-y-4">
        {/* فعال/غیرفعال */}
        <button
          onClick={handleToggleNotification}
          className="w-full flex items-center justify-between py-2"
          disabled={!notifSupported}
        >
          <div className="flex items-center gap-3">
            {notifEnabled ? <Bell size={20} style={{ color: 'var(--color-accent)' }} /> : <BellOff size={20} />}
            <div>
              <span className="block">یادآوری روزانه</span>
              {!notifSupported && (
                <span className="text-[10px]" style={{ color: 'var(--color-danger)' }}>
                  مرورگرت از نوتیفیکیشن پشتیبانی نمیکنه
                </span>
              )}
              {notifSupported && permissionStatus === 'denied' && (
                <span className="text-[10px]" style={{ color: 'var(--color-danger)' }}>
                  مجوز مسدود شده — از تنظیمات مرورگر فعال کن
                </span>
              )}
            </div>
          </div>
          <div className="w-12 h-6 rounded-full p-1 flex items-center transition-all duration-300" style={{ backgroundColor: notifEnabled ? 'var(--color-accent)' : 'var(--color-border)', justifyContent: notifEnabled ? 'flex-start' : 'flex-end', opacity: notifSupported ? 1 : 0.5 }}>
            <div className="w-4 h-4 rounded-full bg-white transition-all duration-300" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          </div>
        </button>

        {/* انتخاب ساعت */}
        {notifEnabled && (
          <>
            <div className="modo-divider" />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} style={{ color: 'var(--color-accent)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>ساعت یادآوری</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {REMINDER_TIMES.map((time) => {
                  const isSelected = notifHour === time.hour && notifMinute === time.minute
                  return (
                    <button
                      key={`${time.hour}-${time.minute}`}
                      onClick={() => handleTimeChange(time.hour, time.minute)}
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95"
                      style={{
                        backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
                        color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                        border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      }}
                    >
                      {time.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ═══ عملیات ═══ */}
      <div className="modo-card space-y-2">
        <button onClick={handleRedoOnboarding} className="w-full flex items-center justify-between py-2">
          <div className="flex items-center gap-2"><RotateCcw size={18} />انجام مجدد آنبوردینگ</div>
          <ChevronLeft size={18} />
        </button>
        <button onClick={handleClearChat} className="w-full flex items-center justify-between py-2">
          <div className="flex items-center gap-2"><MessageCircle size={18} />پاک کردن تاریخچه چت</div>
          <ChevronLeft size={18} />
        </button>
        <button onClick={handleResetAll} className="w-full flex items-center justify-between py-2" style={{ color: 'var(--color-danger)' }}>
          <div className="flex items-center gap-2"><AlertTriangle size={18} />پاک کردن تمام داده‌ها</div>
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* ═══ درباره ═══ */}
      <div className="modo-card">
        <button onClick={() => setShowAbout(true)} className="w-full flex items-center justify-between py-2">
          <div className="flex items-center gap-2"><Info size={18} />درباره MODO</div>
          <ChevronLeft size={18} />
        </button>
      </div>

      <p className="text-center text-xs" style={{ color: 'var(--color-text-secondary)' }}>MODO v1.2.0</p>

      {/* مودال درباره */}
      {showAbout && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4" style={{ backgroundColor: 'var(--color-overlay)' }} onClick={(e) => { if (e.target === e.currentTarget) setShowAbout(false) }}>
          <div className="modo-card-glass max-w-md w-full animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={20} style={{ color: 'var(--color-accent)' }} />
                <h2 className="text-lg font-bold">درباره MODO</h2>
              </div>
              <button onClick={() => setShowAbout(false)} className="p-1 rounded-lg transition-all active:scale-90"><X size={20} /></button>
            </div>
            <p className="text-sm leading-7" style={{ color: 'var(--color-text-secondary)' }}>
              MODO یک کوچ هوشمند شخصیه که بهت کمک میکنه ساختار بسازی، اجرا کنی و هر روز یک قدم جلوتر بری.
            </p>
            <p className="text-sm leading-7 mt-3" style={{ color: 'var(--color-text-secondary)' }}>
              ساخته شده توسط امیرمحمود خاکنه
            </p>
            <button onClick={() => setShowAbout(false)} className="modo-btn modo-btn-primary w-full mt-4 py-3">بستن</button>
          </div>
        </div>
      )}
    </div>
  )
}
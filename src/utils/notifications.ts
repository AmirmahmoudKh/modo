// src/utils/notifications.ts
// ─────────────────────────────────────
// سیستم نوتیفیکیشن روزانه MODO
// ─────────────────────────────────────

// ─── پیام‌های یادآوری ───
const REMINDER_MESSAGES = [
  'امروز تسک‌هات رو چک کردی؟ بیا یه نگاه بندازیم.',
  'یه قدم کوچیک هر روز، تغییر بزرگ هر ماه.',
  'وقتشه یه سر به اهدافت بزنی. منتظرتم.',
  'امروز چطور بود؟ بیا باهم مرورش کنیم.',
  'streak رو نشکن! بیا فعالیت امروز رو ثبت کنیم.',
  'هنوز کار امروز مونده. بیا تمومش کنیم.',
  'یه چت کوتاه با MODO میتونه روزت رو بسازه.',
  'نذار امروز بدون پیشرفت تموم بشه.',
  'بهترین زمان برای شروع همین الانه.',
  'فقط ۵ دقیقه وقت بذار. شروعش سخته، ادامش آسون.',
]

// ─── وضعیت پشتیبانی ───
export function isNotificationSupported(): boolean {
  return 'Notification' in window
}

// ─── وضعیت مجوز ───
export function getPermissionStatus(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported'
  return Notification.permission
}

// ─── درخواست مجوز ───
export async function requestPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false

  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false

  const result = await Notification.requestPermission()
  return result === 'granted'
}

// ─── نمایش نوتیفیکیشن ───
export function showNotification(title: string, body: string): void {
  if (!isNotificationSupported()) return
  if (Notification.permission !== 'granted') return

  try {
    const notification = new Notification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      dir: 'rtl',
      lang: 'fa',
      tag: 'modo-reminder',
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    // بستن خودکار بعد ۸ ثانیه
    setTimeout(() => notification.close(), 8000)
  } catch (error) {
    console.error('خطا در نمایش نوتیفیکیشن:', error)
  }
}

// ─── نمایش یادآوری روزانه ───
export function showDailyReminder(): void {
  const randomIndex = Math.floor(Math.random() * REMINDER_MESSAGES.length)
  const message = REMINDER_MESSAGES[randomIndex]
  showNotification('MODO', message)
}

// ─── تنظیمات نوتیفیکیشن ───
export interface NotificationSettings {
  enabled: boolean
  hour: number
  minute: number
}

const SETTINGS_KEY = 'modo-notification-settings'
const LAST_NOTIF_KEY = 'modo-last-notification-date'

export function getNotificationSettings(): NotificationSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    if (saved) return JSON.parse(saved)
  } catch (error: unknown) {
    void error
    console.warn('خطا در خواندن تنظیمات نوتیفیکیشن')
  }
  return { enabled: false, hour: 21, minute: 0 }
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

// ─── چک روزانه ───
export function checkAndSendDailyNotification(): void {
  const settings = getNotificationSettings()
  if (!settings.enabled) return
  if (Notification.permission !== 'granted') return

  const now = new Date()
  const today = now.toISOString().split('T')[0]

  const lastSent = localStorage.getItem(LAST_NOTIF_KEY)
  if (lastSent === today) return

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const targetMinutes = settings.hour * 60 + settings.minute

  if (currentMinutes >= targetMinutes) {
    showDailyReminder()
    localStorage.setItem(LAST_NOTIF_KEY, today)
  }
}

// ─── شروع چک دوره‌ای ───
let intervalId: number | null = null

export function startNotificationScheduler(): void {
  checkAndSendDailyNotification()

  if (intervalId) clearInterval(intervalId)
  intervalId = window.setInterval(() => {
    checkAndSendDailyNotification()
  }, 5 * 60 * 1000)
}

export function stopNotificationScheduler(): void {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}
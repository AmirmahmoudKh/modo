// src/components/home/DailyMessage.tsx
// ─────────────────────────────────────
// پیام انگیزشی روزانه از MODO
// فعلاً از یه لیست آماده استفاده میکنیم
// بعداً AI این رو شخصی‌سازی میکنه
// ─────────────────────────────────────

// لیست پیام‌های انگیزشی
const DAILY_MESSAGES = [
  { text: 'امروز یه فرصت جدیده. لازم نیست عالی باشی، فقط شروع کن.', icon: '🌅' },
  { text: 'قدم‌های کوچیک، نتیجه‌های بزرگ. امروز یه قدم بردار.', icon: '👣' },
  { text: 'دیروز تموم شد. امروز مال توئه. چی ازش می‌خوای؟', icon: '✨' },
  { text: 'بجای فکر کردن به همه‌چیز، فقط یه کار رو انجام بده.', icon: '🎯' },
  { text: 'انگیزه میاد و میره. سیستم می‌مونه. سیستمت رو بساز.', icon: '⚙️' },
  { text: 'از خودت بپرس: نسخه بهتر من امروز چیکار میکنه؟', icon: '🪞' },
  { text: 'هر روز که اینجایی، داری ثابت میکنی برات مهمه.', icon: '💪' },
  { text: 'نیازی نیست انگیزه داشته باشی. فقط شروع کن، انگیزه میاد.', icon: '🔑' },
  { text: 'مقایسه خودت با دیروزت کن، نه با بقیه.', icon: '📈' },
  { text: 'تغییر سخته. ولی تو از سخت‌تر از اینا رد شدی.', icon: '🏔️' },
  { text: 'بدن حرکت می‌خواد، ذهن نظم می‌خواد. بهشون بده.', icon: '🧠' },
  { text: 'الان بهترین زمان شروعه. نه فردا، نه دوشنبه. الان.', icon: '⏰' },
  { text: 'یه لیست کوچیک بنویس. ۳ تا کار. همین.', icon: '📝' },
  { text: 'موفقیت عادته، نه اتفاق. عادتت رو امروز بساز.', icon: '🔄' },
]

// انتخاب پیام بر اساس روز سال (هر روز یه پیام ثابت)
function getTodayMessage() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
    (1000 * 60 * 60 * 24)
  )
  return DAILY_MESSAGES[dayOfYear % DAILY_MESSAGES.length]
}

interface DailyMessageProps {
  userName: string
}

export default function DailyMessage({ userName }: DailyMessageProps) {
  const message = getTodayMessage()

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: 'var(--color-accent-light)',
        border: '1px solid var(--color-accent)',
      }}
    >
      {/* هدر */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-sm font-bold"
          style={{ color: 'var(--color-accent)' }}
        >
          💬 پیام MODO
        </span>
      </div>

      {/* متن پیام */}
      <p
        className="text-sm leading-7"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {message.icon} {userName} عزیز، {message.text}
      </p>
    </div>
  )
}
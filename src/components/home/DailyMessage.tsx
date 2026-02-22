// src/components/home/DailyMessage.tsx

import { MessageCircle } from 'lucide-react'

const DAILY_MESSAGES = [
  'امروز یه فرصت جدیده. لازم نیست عالی باشی، فقط شروع کن.',
  'قدم‌های کوچیک، نتیجه‌های بزرگ. امروز یه قدم بردار.',
  'دیروز تموم شد. امروز مال توئه. چی ازش می‌خوای؟',
  'بجای فکر کردن به همه‌چیز، فقط یه کار رو انجام بده.',
  'انگیزه میاد و میره. سیستم می‌مونه. سیستمت رو بساز.',
  'از خودت بپرس: نسخه بهتر من امروز چیکار میکنه؟',
  'هر روز که اینجایی، داری ثابت میکنی برات مهمه.',
  'نیازی نیست انگیزه داشته باشی. فقط شروع کن، انگیزه میاد.',
  'مقایسه خودت با دیروزت کن، نه با بقیه.',
  'تغییر سخته. ولی تو از سخت‌تر از اینا رد شدی.',
  'بدن حرکت می‌خواد، ذهن نظم می‌خواد. بهشون بده.',
  'الان بهترین زمان شروعه. نه فردا، نه دوشنبه. الان.',
  'یه لیست کوچیک بنویس. سه تا کار. همین.',
  'موفقیت عادته، نه اتفاق. عادتت رو امروز بساز.',
]

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
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle size={16} style={{ color: 'var(--color-accent)' }} />
        <span
          className="text-sm font-bold"
          style={{ color: 'var(--color-accent)' }}
        >
          پیام MODO
        </span>
      </div>

      <p
        className="text-sm leading-7"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {userName} عزیز، {message}
      </p>
    </div>
  )
}
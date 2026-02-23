// src/components/home/DailyMessage.tsx
// ─────────────────────────────────────
// پیام روزانه هوشمند MODO
// ─────────────────────────────────────

import { Lightbulb } from 'lucide-react'

interface DailyMessageProps {
  userName: string
  streak?: number
}

// ─── ساعت روز ───
function getTimeSlot(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 20) return 'evening'
  return 'night'
}

// ─── سلام بر اساس ساعت ───
function getGreeting(name: string): string {
  const slot = getTimeSlot()
  const greetings = {
    morning: `صبح بخیر ${name}`,
    afternoon: `${name}، خسته نباشی`,
    evening: `عصرت بخیر ${name}`,
    night: `شبت آروم ${name}`,
  }
  return greetings[slot]
}

// ─── پیام‌ها ───
function getMessage(streak: number): string {
  const slot = getTimeSlot()
  const dayOfMonth = new Date().getDate()

  const messages: Record<string, Record<string, string[]>> = {
    morning: {
      zero: [
        'امروز روز شروعه. یه کار کوچیک انتخاب کن و انجامش بده.',
        'هر روز بزرگ با یه قدم کوچیک شروع میشه. امروز اون قدم رو بردار.',
        'دیروز هرچی بود تموم شد. امروز فرصت جدیده.',
      ],
      low: [
        `${streak} روزه داری میجنگی. ادامه بده، داره عادت میشه.`,
        'داری مسیر رو پیدا میکنی. امروز هم یه قدم دیگه جلو برو.',
        `${streak} روز متوالی. خوبه ولی هنوز اول راهی. ادامه بده.`,
      ],
      mid: [
        `${streak} روزه فعالی. داری عادت میسازی. نذار زنجیره قطع بشه.`,
        'ذهنت داره به نظم عادت میکنه. این خیلی ارزشمنده.',
        `${streak} روز. دیگه این فقط یه تلاش نیست، داره بخشی از زندگیت میشه.`,
      ],
      high: [
        `${streak} روز متوالی. خوب کار کردی. ولی هنوز تمومش نکن.`,
        'تو الان جزو اون درصد کمی هستی که واقعا عمل میکنه.',
        `${streak} روز. کم نیست. ولی بهترین روزات هنوز جلوتره.`,
      ],
    },
    afternoon: {
      zero: [
        'نصف روز گذشته. هنوز میتونی یه کار مفید انجام بدی.',
        'بعدازظهر وقت خوبیه برای شروع. یه تسک از لیستت رو انجام بده.',
        'ذهنت خسته‌ست؟ ۵ دقیقه پیاده‌روی کن بعد ادامه بده.',
      ],
      low: [
        'تسک‌های امروز رو چک کن. چندتاشون مونده؟',
        `${streak} روزه فعالی. بقیه تسک‌هات رو هم بزن.`,
        'بعدازظهر وقت خوبیه برای تموم کردن کارای نصفه.',
      ],
      mid: [
        'امروز تسک‌هات رو زدی؟ ادامه بده.',
        `${streak} روز streak. نذار امروز قطع بشه.`,
        'اگه خسته‌ای استراحت کن ولی ول نکن.',
      ],
      high: [
        'تو خودت بهتر از من میدونی چیکار باید بکنی. فقط اجرا کن.',
        `${streak} روز. سیستمت داره کار میکنه. فقط ادامه بده.`,
        'به خودت ببال ولی متوقف نشو.',
      ],
    },
    evening: {
      zero: [
        'هنوز وقت هست. یه کار کوچیک انجام بده و روزت رو نجات بده.',
        'عصر وقت خوبیه برای فکر کردن. فردا رو برنامه‌ریزی کن.',
        'اگه امروز هیچی نکردی اشکال نداره. فردا از نو شروع کن.',
      ],
      low: [
        'لیست فردا رو بنویس. سه تا کار مهم. همین.',
        `${streak} روز. فردا رو هم بهش اضافه کن.`,
        'امشب زودتر بخواب. فردا انرژی بیشتری داری.',
      ],
      mid: [
        'امروز خوب بود؟ فردا رو بهتر کن.',
        `${streak} روز ادامه‌دار. خوبه. حالا برنامه فردا رو بریز.`,
        'استراحت هم بخشی از سیستمه. فقط ساعت خواب رو خراب نکن.',
      ],
      high: [
        `${streak} روز. تو یه ماشین شدی. فقط سوختت رو تامین کن.`,
        'فردا رو هم بچسبون به streak. ولی امشب خوب بخواب.',
        'به خودت استراحت بده. فردا باز ادامه میدی.',
      ],
    },
    night: {
      zero: [
        'فردا فرصت تازه‌ست. الان فقط بخواب.',
        'الان مهم‌ترین کار خوابه. فردا شروع میکنیم.',
        'شب وقت فکر کردن زیاده. ولی الان فقط بخواب.',
      ],
      low: [
        'بخواب. فردا ادامه میدیم.',
        'گوشی رو بذار کنار و بخواب. فردا روز مهمیه.',
        `${streak} روز. بخواب تا فردا ${streak + 1} بشه.`,
      ],
      mid: [
        'خوب کار کردی. حالا بخواب.',
        'مغزت استراحت لازم داره. بخواب.',
        `${streak} روز فعالیت. شب بخیر.`,
      ],
      high: [
        `${streak} روز. خوب بود. شب بخیر.`,
        'چراغ رو خاموش کن. فردا باز میجنگی.',
        'بخواب. مغز خسته نمیتونه فردا خوب کار کنه.',
      ],
    },
  }

  let streakLevel: string
  if (streak === 0) streakLevel = 'zero'
  else if (streak < 4) streakLevel = 'low'
  else if (streak < 10) streakLevel = 'mid'
  else streakLevel = 'high'

  const pool = messages[slot]?.[streakLevel] || messages[slot]?.zero || ['ادامه بده.']
  const index = dayOfMonth % pool.length

  return pool[index]
}

export default function DailyMessage({ userName, streak = 0 }: DailyMessageProps) {
  const greeting = getGreeting(userName)
  const message = getMessage(streak)

  return (
    <div
      className="modo-card"
      style={{
        borderRight: '3px solid var(--color-accent)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
          style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            color: 'var(--color-accent)',
          }}
        >
          <Lightbulb size={18} />
        </div>

        <div className="flex-1">
          <p
            className="text-sm font-bold mb-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {greeting}
          </p>
          <p
            className="text-sm leading-6"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
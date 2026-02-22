// src/utils/db.ts
// ─────────────────────────────────────
// تعریف دیتابیس MODO
// اینجا مشخص می‌کنیم چه جداولی داریم و هر جدول چه ستون‌هایی داره
// ─────────────────────────────────────

import Dexie, { type Table } from 'dexie'

// ═══════════════════════════════════════
// تعریف تایپ‌ها (شکل هر نوع داده)
// ═══════════════════════════════════════

// ─── پروفایل کاربر ───
export interface UserProfile {
  id?: number              // شناسه (خودکار ساخته میشه)
  name: string             // اسم
  age: number              // سن
  status: string           // وضعیت (دانشجو، شاغل، ...)
  goals: string[]          // اهداف انتخاب‌شده در آنبوردینگ
  sleepTime: string        // ساعت خواب
  wakeTime: string         // ساعت بیداری
  focusLevel: string       // سطح تمرکز
  screenTime: string       // زمان صفحه‌نمایش
  motivation: string       // انگیزه اصلی
  createdAt: Date          // تاریخ ساخت
}

// ─── پیام چت ───
export interface ChatMessage {
  id?: number              // شناسه
  role: 'user' | 'assistant'  // کی فرستاده: کاربر یا MODO
  content: string          // متن پیام
  timestamp: Date          // زمان ارسال
}

// ─── هدف ───
export interface Goal {
  id?: number              // شناسه
  title: string            // عنوان هدف
  description: string      // توضیحات
  status: 'active' | 'completed' | 'archived'  // وضعیت
  createdAt: Date          // تاریخ ساخت
  completedAt?: Date       // تاریخ تکمیل (اختیاری)
}

// ─── فعالیت روزانه ───
export interface DailyActivity {
  id?: number              // شناسه
  date: string             // تاریخ (فرمت: "2025-01-20")
  active: boolean          // آیا فعال بوده؟
  tasksCompleted: number   // تعداد تسک‌های انجام‌شده
}

// ─── نشان/مدال ───
export interface Badge {
  id: string               // شناسه نشان (مثلاً "first_week")
  name: string             // اسم فارسی
  description: string      // توضیح
  icon: string             // ایموجی
  earnedAt?: Date          // تاریخ کسب (اگه کسب نکرده → undefined)
}

// ═══════════════════════════════════════
// ساخت دیتابیس
// ═══════════════════════════════════════

class ModoDatabase extends Dexie {
  // تعریف جداول با تایپ‌هاشون
  userProfile!: Table<UserProfile>
  chatMessages!: Table<ChatMessage>
  goals!: Table<Goal>
  dailyActivity!: Table<DailyActivity>
  badges!: Table<Badge>

  constructor() {
    super('ModoDatabase')  // اسم دیتابیس

    // ─── تعریف ساختار جداول ───
    // عدد 1 = ورژن دیتابیس
    // ++ = شناسه خودکار (auto-increment)
    // بقیه = ستون‌هایی که می‌خوایم روشون جستجو کنیم
    this.version(1).stores({
      userProfile:   '++id',
      chatMessages:  '++id, role, timestamp',
      goals:         '++id, status, createdAt',
      dailyActivity: '++id, date',
      badges:        'id, earnedAt',
    })
  }
}

// ─── یه نمونه از دیتابیس بساز و Export کن ───
// همه جای اپ از همین یه نمونه استفاده می‌کنن
export const db = new ModoDatabase()
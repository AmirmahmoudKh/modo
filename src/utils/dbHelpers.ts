// src/utils/dbHelpers.ts
// ─────────────────────────────────────
// توابع کمکی برای کار با دیتابیس
// هر عملیاتی که روی دیتابیس نیاز داریم، اینجا تعریف شده
// ─────────────────────────────────────

import { db } from './db'
import type { UserProfile, ChatMessage, Goal, DailyActivity } from './db'

// ═══════════════════════════════════════
// 👤 پروفایل کاربر
// ═══════════════════════════════════════

// ذخیره پروفایل (آنبوردینگ)
export async function saveUserProfile(profile: Omit<UserProfile, 'id' | 'createdAt'>) {
  // Omit یعنی: همه فیلدها بجز id و createdAt رو بده
  // چون اونا خودکار ساخته میشن

  // اول پروفایل قبلی رو پاک کن (فقط یه کاربر داریم)
  await db.userProfile.clear()

  // پروفایل جدید رو ذخیره کن
  const id = await db.userProfile.add({
    ...profile,
    createdAt: new Date(),
  })

  return id
}

// خواندن پروفایل
export async function getUserProfile(): Promise<UserProfile | undefined> {
  // اولین (و تنها) پروفایل رو برگردون
  const profiles = await db.userProfile.toArray()
  return profiles[0]
}

// چک کن آیا آنبوردینگ انجام شده
export async function hasCompletedOnboarding(): Promise<boolean> {
  const count = await db.userProfile.count()
  return count > 0
}


// ═══════════════════════════════════════
// 💬 چت
// ═══════════════════════════════════════

// ذخیره پیام جدید
export async function saveChatMessage(
  role: 'user' | 'assistant',
  content: string
) {
  const id = await db.chatMessages.add({
    role,
    content,
    timestamp: new Date(),
  })
  return id
}

// خواندن تاریخچه چت
export async function getChatHistory(limit: number = 50): Promise<ChatMessage[]> {
  // آخرین پیام‌ها رو بگیر، مرتب شده بر اساس زمان
  const messages = await db.chatMessages
    .orderBy('timestamp')
    .reverse()        // جدیدترین اول
    .limit(limit)     // حداکثر limit تا
    .toArray()

  return messages.reverse() // برعکس کن تا قدیمی‌ترین اول باشه
}

// پاک کردن تمام چت‌ها
export async function clearChatHistory() {
  await db.chatMessages.clear()
}


// ═══════════════════════════════════════
// 🎯 اهداف
// ═══════════════════════════════════════

// ساخت هدف جدید
export async function createGoal(title: string, description: string) {
  const id = await db.goals.add({
    title,
    description,
    status: 'active',
    createdAt: new Date(),
  })
  return id
}

// خواندن همه اهداف
export async function getAllGoals(): Promise<Goal[]> {
  return await db.goals.orderBy('createdAt').reverse().toArray()
}

// خواندن اهداف بر اساس وضعیت
export async function getGoalsByStatus(
  status: 'active' | 'completed' | 'archived'
): Promise<Goal[]> {
  return await db.goals
    .where('status')
    .equals(status)
    .reverse()
    .toArray()
}

// بروزرسانی هدف
export async function updateGoal(
  id: number,
  updates: Partial<Goal>
) {
  // Partial یعنی: هر کدوم از فیلدها رو بده، لازم نیست همه
  await db.goals.update(id, updates)
}

// تکمیل هدف
export async function completeGoal(id: number) {
  await db.goals.update(id, {
    status: 'completed',
    completedAt: new Date(),
  })
}

// آرشیو هدف
export async function archiveGoal(id: number) {
  await db.goals.update(id, { status: 'archived' })
}

// حذف هدف
export async function deleteGoal(id: number) {
  await db.goals.delete(id)
}

// تعداد اهداف تکمیل‌شده
export async function getCompletedGoalsCount(): Promise<number> {
  return await db.goals.where('status').equals('completed').count()
}


// ═══════════════════════════════════════
// 📊 فعالیت روزانه و Streak
// ═══════════════════════════════════════

// تابع کمکی: تاریخ امروز به فرمت "2025-01-20"
export function getTodayString(): string {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

// ثبت فعالیت امروز
export async function recordDailyActivity(tasksCompleted: number = 0) {
  const today = getTodayString()

  // چک کن آیا امروز قبلاً ثبت شده
  const existing = await db.dailyActivity
    .where('date')
    .equals(today)
    .first()

  if (existing) {
    // آپدیت کن
    await db.dailyActivity.update(existing.id!, {
      active: true,
      tasksCompleted: existing.tasksCompleted + tasksCompleted,
    })
  } else {
    // جدید بساز
    await db.dailyActivity.add({
      date: today,
      active: true,
      tasksCompleted,
    })
  }
}

// محاسبه Streak (روزهای متوالی فعال)
export async function calculateStreak(): Promise<number> {
  // همه فعالیت‌ها رو بگیر، مرتب شده بر اساس تاریخ (جدید → قدیم)
  const activities = await db.dailyActivity
    .orderBy('date')
    .reverse()
    .toArray()

  if (activities.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)  // شروع روز

  for (let i = 0; i < activities.length; i++) {
    // تاریخ مورد انتظار: امروز - i روز
    const expectedDate = new Date(today)
    expectedDate.setDate(expectedDate.getDate() - i)
    const expectedStr = expectedDate.toISOString().split('T')[0]

    if (activities[i].date === expectedStr && activities[i].active) {
      streak++
    } else {
      break  // زنجیره قطع شد
    }
  }

  return streak
}

// خواندن فعالیت‌های ۳۰ روز اخیر (برای تقویم)
export async function getRecentActivity(days: number = 30): Promise<DailyActivity[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  const startStr = startDate.toISOString().split('T')[0]

  return await db.dailyActivity
    .where('date')
    .above(startStr)
    .toArray()
}


// ═══════════════════════════════════════
// 🏆 نشان‌ها (Badges)
// ═══════════════════════════════════════

// لیست تمام نشان‌های ممکن
export const ALL_BADGES = [
  {
    id: 'first_step',
    name: 'اولین قدم',
    description: 'آنبوردینگ رو تکمیل کردی',
    icon: '🌱',
  },
  {
    id: 'first_chat',
    name: 'اولین گفتگو',
    description: 'اولین چتت با MODO',
    icon: '💬',
  },
  {
    id: 'first_goal',
    name: 'هدف‌گذار',
    description: 'اولین هدفت رو ساختی',
    icon: '🎯',
  },
  {
    id: 'goal_crusher',
    name: 'هدف‌شکن',
    description: 'اولین هدفت رو تکمیل کردی',
    icon: '💪',
  },
  {
    id: 'three_days',
    name: 'سه‌روزه',
    description: '۳ روز متوالی فعال بودی',
    icon: '🔥',
  },
  {
    id: 'one_week',
    name: 'یه هفته‌ای',
    description: '۷ روز متوالی فعال بودی',
    icon: '⭐',
  },
  {
    id: 'two_weeks',
    name: 'دو هفته‌ای',
    description: '۱۴ روز متوالی فعال بودی',
    icon: '🏆',
  },
  {
    id: 'one_month',
    name: 'یه ماهه',
    description: '۳۰ روز متوالی فعال بودی',
    icon: '👑',
  },
]

// کسب نشان
export async function earnBadge(badgeId: string) {
  const badge = ALL_BADGES.find(b => b.id === badgeId)
  if (!badge) return

  // چک کن قبلاً کسب نکرده باشه
  const existing = await db.badges.get(badgeId)
  if (existing?.earnedAt) return  // قبلاً داره

  await db.badges.put({
    ...badge,
    earnedAt: new Date(),
  })
}

// خواندن نشان‌های کسب‌شده
export async function getEarnedBadges() {
  const earned = await db.badges.toArray()
  return earned.filter(b => b.earnedAt)
}

// چک و اعطای نشان‌های خودکار
export async function checkAndAwardBadges() {
  const streak = await calculateStreak()
  const completedGoals = await getCompletedGoalsCount()
  const chatCount = await db.chatMessages
    .where('role')
    .equals('user')
    .count()

  // نشان‌های مبتنی بر Streak
  if (streak >= 3)  await earnBadge('three_days')
  if (streak >= 7)  await earnBadge('one_week')
  if (streak >= 14) await earnBadge('two_weeks')
  if (streak >= 30) await earnBadge('one_month')

  // نشان‌های مبتنی بر هدف
  if (completedGoals >= 1) await earnBadge('goal_crusher')

  // نشان‌های مبتنی بر چت
  if (chatCount >= 1) await earnBadge('first_chat')
}


// ═══════════════════════════════════════
// 🗑️ ریست کامل
// ═══════════════════════════════════════

export async function resetAllData() {
  await db.userProfile.clear()
  await db.chatMessages.clear()
  await db.goals.clear()
  await db.dailyActivity.clear()
  await db.badges.clear()
}
// src/utils/dbHelpers.ts
// ─────────────────────────────────────
// توابع کمکی برای کار با دیتابیس
// ─────────────────────────────────────

import { db } from './db'
import type { UserProfile, ChatMessage, Goal, DailyActivity, Task } from './db'

// ═══════════════════════════════════════
// 👤 پروفایل کاربر
// ═══════════════════════════════════════

export async function saveUserProfile(profile: Omit<UserProfile, 'id' | 'createdAt'>) {
  await db.userProfile.clear()
  const id = await db.userProfile.add({
    ...profile,
    createdAt: new Date(),
  })
  return id
}

export async function getUserProfile(): Promise<UserProfile | undefined> {
  const profiles = await db.userProfile.toArray()
  return profiles[0]
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  const count = await db.userProfile.count()
  return count > 0
}

// ═══════════════════════════════════════
// 💬 چت
// ═══════════════════════════════════════

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

export async function getChatHistory(limit: number = 50): Promise<ChatMessage[]> {
  const messages = await db.chatMessages
    .orderBy('timestamp')
    .reverse()
    .limit(limit)
    .toArray()
  return messages.reverse()
}

export async function clearChatHistory() {
  await db.chatMessages.clear()
}

// ═══════════════════════════════════════
// 🎯 اهداف
// ═══════════════════════════════════════

export async function createGoal(title: string, description: string) {
  const id = await db.goals.add({
    title,
    description,
    status: 'active',
    createdAt: new Date(),
  })
  return id
}

export async function getAllGoals(): Promise<Goal[]> {
  return await db.goals.orderBy('createdAt').reverse().toArray()
}

export async function getGoalsByStatus(
  status: 'active' | 'completed' | 'archived'
): Promise<Goal[]> {
  return await db.goals
    .where('status')
    .equals(status)
    .reverse()
    .toArray()
}

export async function updateGoal(id: number, updates: Partial<Goal>) {
  await db.goals.update(id, updates)
}

export async function completeGoal(id: number) {
  await db.goals.update(id, {
    status: 'completed',
    completedAt: new Date(),
  })
}

export async function archiveGoal(id: number) {
  await db.goals.update(id, { status: 'archived' })
}

export async function deleteGoal(id: number) {
  await db.goals.delete(id)
}

export async function getCompletedGoalsCount(): Promise<number> {
  return await db.goals.where('status').equals('completed').count()
}

// ═══════════════════════════════════════
// 📊 فعالیت روزانه و Streak
// ═══════════════════════════════════════

export function getTodayString(): string {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

export async function recordDailyActivity(tasksCompleted: number = 0) {
  const today = getTodayString()
  const existing = await db.dailyActivity
    .where('date')
    .equals(today)
    .first()

  if (existing) {
    await db.dailyActivity.update(existing.id!, {
      active: true,
      tasksCompleted: existing.tasksCompleted + tasksCompleted,
    })
  } else {
    await db.dailyActivity.add({
      date: today,
      active: true,
      tasksCompleted,
    })
  }
}

export async function calculateStreak(): Promise<number> {
  const activities = await db.dailyActivity
    .orderBy('date')
    .reverse()
    .toArray()

  if (activities.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < activities.length; i++) {
    const expectedDate = new Date(today)
    expectedDate.setDate(expectedDate.getDate() - i)
    const expectedStr = expectedDate.toISOString().split('T')[0]

    if (activities[i].date === expectedStr && activities[i].active) {
      streak++
    } else {
      break
    }
  }

  return streak
}

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
  {
    id: 'task_master',
    name: 'تسک‌مستر',
    description: 'همه تسک‌های یه روز رو انجام دادی',
    icon: '✨',
  },
]

export async function earnBadge(badgeId: string) {
  const badge = ALL_BADGES.find(b => b.id === badgeId)
  if (!badge) return

  const existing = await db.badges.get(badgeId)
  if (existing?.earnedAt) return

  await db.badges.put({
    ...badge,
    earnedAt: new Date(),
  })
}

export async function getEarnedBadges() {
  const earned = await db.badges.toArray()
  return earned.filter(b => b.earnedAt)
}

export async function checkAndAwardBadges() {
  const streak = await calculateStreak()
  const completedGoals = await getCompletedGoalsCount()
  const chatCount = await db.chatMessages
    .where('role')
    .equals('user')
    .count()

  if (streak >= 3)  await earnBadge('three_days')
  if (streak >= 7)  await earnBadge('one_week')
  if (streak >= 14) await earnBadge('two_weeks')
  if (streak >= 30) await earnBadge('one_month')
  if (completedGoals >= 1) await earnBadge('goal_crusher')
  if (chatCount >= 1) await earnBadge('first_chat')

  // نشان تسک‌مستر: همه تسک‌های امروز انجام شده
  const todayStats = await getTodayTaskStats()
  if (todayStats.total > 0 && todayStats.completed === todayStats.total) {
    await earnBadge('task_master')
  }
}

// ═══════════════════════════════════════
// 📋 تسک‌های روزانه (سیستم هوشمند)
// ═══════════════════════════════════════

// تسک‌های پیشنهادی بر اساس اهداف آنبوردینگ
const GOAL_TASK_MAP: { keywords: string[]; title: string; icon: string }[] = [
  {
    keywords: ['روتین', 'routine', 'build_routine', 'روزانه'],
    title: 'یه روتین صبحگاهی ۱۰ دقیقه‌ای انجام بده',
    icon: '🌅',
  },
  {
    keywords: ['هدف', 'مسیر', 'purpose', 'find_purpose'],
    title: '۱۰ دقیقه درباره اهداف و مسیرت بنویس',
    icon: '🧭',
  },
  {
    keywords: ['تمرکز', 'focus', 'improve_focus'],
    title: '۲۵ دقیقه تمرکز بدون گوشی',
    icon: '🧠',
  },
  {
    keywords: ['خواب', 'sleep', 'better_sleep'],
    title: 'امشب ساعت ۱۱ گوشی رو بذار کنار',
    icon: '🌙',
  },
  {
    keywords: ['یادگیری', 'مهارت', 'learn', 'skill', 'learn_skill'],
    title: '۳۰ دقیقه مطالعه یا یادگیری',
    icon: '📖',
  },
  {
    keywords: ['سلامت', 'روان', 'mental', 'health', 'mental_health'],
    title: '۱۰ دقیقه پیاده‌روی یا تنفس عمیق',
    icon: '💚',
  },
  {
    keywords: ['اسکرین', 'screen', 'reduce_screentime', 'screentime'],
    title: '۱ ساعت بدون گوشی سپری کن',
    icon: '📵',
  },
  {
    keywords: ['زمان', 'time', 'time_management', 'مدیریت'],
    title: 'لیست ۳ کار مهم فردا رو بنویس',
    icon: '⏰',
  },
]

const HABIT_TASKS = [
  { title: 'چک‌این روزانه', icon: '✅' },
  { title: 'یه چت با MODO', icon: '💬' },
]

function generateAutoTasksFromGoals(userGoals: string[]): { title: string; icon: string }[] {
  const result: { title: string; icon: string }[] = []

  for (const suggestion of GOAL_TASK_MAP) {
    for (const goal of userGoals) {
      const goalLower = goal.toLowerCase()
      const matched = suggestion.keywords.some(kw => goalLower.includes(kw))
      if (matched && !result.find(r => r.title === suggestion.title)) {
        result.push({ title: suggestion.title, icon: suggestion.icon })
        break
      }
    }
  }

  return result.slice(0, 3)
}

export async function ensureTodayTasks(): Promise<Task[]> {
  const today = getTodayString()
  const generatedKey = 'modo-tasks-generated-date'
  const lastGenerated = localStorage.getItem(generatedKey)

  if (lastGenerated === today) {
    return await db.tasks.where('date').equals(today).toArray()
  }

  // تولید تسک‌های جدید برای امروز
  const profile = await getUserProfile()
  const activeGoals = await getGoalsByStatus('active')
  const newTasks: Omit<Task, 'id'>[] = []

  // ۱. تسک‌های خودکار از اهداف آنبوردینگ
  if (profile?.goals && profile.goals.length > 0) {
    const autoTasks = generateAutoTasksFromGoals(profile.goals)
    for (const task of autoTasks) {
      newTasks.push({
        title: task.title,
        type: 'auto',
        completed: false,
        date: today,
        icon: task.icon,
        createdAt: new Date(),
      })
    }
  }

  // ۲. تسک‌ها برای اهداف فعال (حداکثر ۲ تا)
  for (const goal of activeGoals.slice(0, 2)) {
    newTasks.push({
      title: `کار روی: ${goal.title}`,
      type: 'auto',
      completed: false,
      date: today,
      goalId: goal.id,
      icon: '🎯',
      createdAt: new Date(),
    })
  }

  // ۳. تسک‌های عادتی
  for (const habit of HABIT_TASKS) {
    newTasks.push({
      title: habit.title,
      type: 'habit',
      completed: false,
      date: today,
      icon: habit.icon,
      createdAt: new Date(),
    })
  }

  // ذخیره در دیتابیس
  if (newTasks.length > 0) {
    await db.tasks.bulkAdd(newTasks as Task[])
  }

  localStorage.setItem(generatedKey, today)

  return await db.tasks.where('date').equals(today).toArray()
}

export async function getTodayTasks(): Promise<Task[]> {
  const today = getTodayString()
  return await db.tasks.where('date').equals(today).toArray()
}

export async function toggleTask(taskId: number): Promise<boolean> {
  const task = await db.tasks.get(taskId)
  if (!task) return false

  const newCompleted = !task.completed
  await db.tasks.update(taskId, { completed: newCompleted })
  await syncDailyTaskCount()

  return newCompleted
}

export async function addManualTask(title: string): Promise<number> {
  const today = getTodayString()
  const id = await db.tasks.add({
    title,
    type: 'manual',
    completed: false,
    date: today,
    icon: '📌',
    createdAt: new Date(),
  })
  return id as number
}

export async function deleteTask(taskId: number): Promise<void> {
  await db.tasks.delete(taskId)
  await syncDailyTaskCount()
}

async function syncDailyTaskCount(): Promise<void> {
  const today = getTodayString()
  const allToday = await db.tasks.where('date').equals(today).toArray()
  const completedCount = allToday.filter(t => t.completed).length

  const existing = await db.dailyActivity
    .where('date')
    .equals(today)
    .first()

  if (existing) {
    await db.dailyActivity.update(existing.id!, {
      active: true,
      tasksCompleted: completedCount,
    })
  } else {
    await db.dailyActivity.add({
      date: today,
      active: true,
      tasksCompleted: completedCount,
    })
  }
}

export async function getTodayTaskStats(): Promise<{ total: number; completed: number }> {
  const today = getTodayString()
  const tasks = await db.tasks.where('date').equals(today).toArray()
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
  }
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
  await db.tasks.clear()
  localStorage.removeItem('modo-tasks-generated-date')
}
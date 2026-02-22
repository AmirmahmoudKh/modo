// src/pages/Progress.tsx
// ─────────────────────────────────────
// صفحه ردیابی پیشرفت
// ─────────────────────────────────────

import { useState, useEffect } from 'react'
import StreakCard from '../components/progress/StreakCard'
import StatsOverview from '../components/progress/StatsOverview'
import ActivityCalendar from '../components/progress/ActivityCalendar'
import BadgeList from '../components/progress/BadgeList'
import {
  calculateStreak,
  getRecentActivity,
  getAllGoals,
  getCompletedGoalsCount,
  getEarnedBadges,
} from '../utils/dbHelpers'
import { db } from '../utils/db'
import type { DailyActivity, Badge } from '../utils/db'

export default function Progress() {
  const [streak, setStreak] = useState(0)
  const [activities, setActivities] = useState<DailyActivity[]>([])
  const [totalGoals, setTotalGoals] = useState(0)
  const [completedGoals, setCompletedGoals] = useState(0)
  const [totalChats, setTotalChats] = useState(0)
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProgress() {
      try {
        // Streak
        const s = await calculateStreak()
        setStreak(s)

        // فعالیت‌ها (۳۵ روز)
        const acts = await getRecentActivity(35)
        setActivities(acts)

        // اهداف
        const goals = await getAllGoals()
        setTotalGoals(goals.length)

        const completed = await getCompletedGoalsCount()
        setCompletedGoals(completed)

        // تعداد چت‌ها
        const chatCount = await db.chatMessages.count()
        setTotalChats(chatCount)

        // نشان‌ها
        const badges = await getEarnedBadges()
        setEarnedBadges(badges)

      } catch (error) {
        console.error('خطا در بارگذاری:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [])

  // تعداد روزهای فعال
  const totalActiveDays = activities.filter(a => a.active).length

  // لودینگ
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
        📊 پیشرفت من
      </h1>

      {/* Streak */}
      <StreakCard streak={streak} />

      {/* آمار کلی */}
      <StatsOverview
        totalActiveDays={totalActiveDays}
        totalGoals={totalGoals}
        completedGoals={completedGoals}
        totalChats={totalChats}
      />

      {/* تقویم */}
      <ActivityCalendar activities={activities} />

      {/* نشان‌ها */}
      <BadgeList earnedBadges={earnedBadges} />
    </div>
  )
}
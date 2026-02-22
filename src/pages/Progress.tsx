// src/pages/Progress.tsx

import { useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'
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
        const s = await calculateStreak()
        setStreak(s)

        const acts = await getRecentActivity(35)
        setActivities(acts)

        const goals = await getAllGoals()
        setTotalGoals(goals.length)

        const completed = await getCompletedGoalsCount()
        setCompletedGoals(completed)

        const chatCount = await db.chatMessages.count()
        setTotalChats(chatCount)

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

  const totalActiveDays = activities.filter(a => a.active).length

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
      <div className="flex items-center gap-3 mb-2">
        <BarChart3 size={24} style={{ color: 'var(--color-accent)' }} />
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          پیشرفت من
        </h1>
      </div>

      <StreakCard streak={streak} />
      <StatsOverview
        totalActiveDays={totalActiveDays}
        totalGoals={totalGoals}
        completedGoals={completedGoals}
        totalChats={totalChats}
      />
      <ActivityCalendar activities={activities} />
      <BadgeList earnedBadges={earnedBadges} />
    </div>
  )
}
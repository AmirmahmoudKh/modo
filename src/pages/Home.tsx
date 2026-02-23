// src/pages/Home.tsx
// ─────────────────────────────────────
// داشبورد اصلی MODO
// ─────────────────────────────────────

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import {
  getUserProfile,
  calculateStreak,
  recordDailyActivity,
  getGoalsByStatus,
} from '../utils/dbHelpers'
import type { UserProfile, Goal } from '../utils/db'

import DashboardHeader from '../components/home/DashboardHeader'
import QuickStats from '../components/home/QuickStats'
import DailyMessage from '../components/home/DailyMessage'
import ActiveGoalCard from '../components/home/ActiveGoalCard'
import DailyTasks from '../components/home/DailyTasks'

export default function Home() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState<UserProfile | undefined>()
  const [streak, setStreak] = useState(0)
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null)
  const [activeGoalsCount, setActiveGoalsCount] = useState(0)
  const [todayCompleted, setTodayCompleted] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const userProfile = await getUserProfile()
        setProfile(userProfile)

        await recordDailyActivity()

        const currentStreak = await calculateStreak()
        setStreak(currentStreak)

        const goals = await getGoalsByStatus('active')
        setActiveGoalsCount(goals.length)
        setActiveGoal(goals.length > 0 ? goals[0] : null)
      } catch (error) {
        console.error('خطا در بارگذاری:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleTaskChange = (completed: number, _total: number) => {
    setTodayCompleted(completed)
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[80vh]">
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

  const userName = profile?.name || 'دوست'

  return (
    <div className="p-6 space-y-4 pb-24">
      <DashboardHeader userName={userName} />

      <QuickStats
        streak={streak}
        todayTasks={todayCompleted}
        activeGoals={activeGoalsCount}
      />

      {/* پیام روزانه - حالا streak هم میگیره */}
      <DailyMessage userName={userName} streak={streak} />

      <DailyTasks onTaskChange={handleTaskChange} />

      <ActiveGoalCard goal={activeGoal} />

      <button
        onClick={() => navigate('/chat')}
        className="w-full rounded-2xl p-4 flex items-center justify-center gap-3 text-white font-bold text-lg modo-btn modo-btn-primary"
      >
        <MessageCircle size={22} />
        <span>شروع چت با MODO</span>
      </button>
    </div>
  )
}
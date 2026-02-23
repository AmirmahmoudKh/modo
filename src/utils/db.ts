// src/utils/db.ts
// ─────────────────────────────────────
// تعریف دیتابیس MODO
// ─────────────────────────────────────

import Dexie, { type Table } from 'dexie'

// ─── پروفایل کاربر ───
export interface UserProfile {
  id?: number
  name: string
  age: number
  status: string
  goals: string[]
  sleepTime: string
  wakeTime: string
  focusLevel: string
  screenTime: string
  motivation: string
  createdAt: Date
}

// ─── پیام چت ───
export interface ChatMessage {
  id?: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// ─── هدف ───
export interface Goal {
  id?: number
  title: string
  description: string
  status: 'active' | 'completed' | 'archived'
  createdAt: Date
  completedAt?: Date
}

// ─── فعالیت روزانه ───
export interface DailyActivity {
  id?: number
  date: string
  active: boolean
  tasksCompleted: number
}

// ─── نشان ───
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt?: Date
}

// ─── تسک روزانه ───
export interface Task {
  id?: number
  title: string
  type: 'auto' | 'manual' | 'habit'
  completed: boolean
  date: string
  goalId?: number
  icon: string
  createdAt: Date
}

// ═══════════════════════════════════════
// ساخت دیتابیس
// ═══════════════════════════════════════

class ModoDatabase extends Dexie {
  userProfile!: Table<UserProfile>
  chatMessages!: Table<ChatMessage>
  goals!: Table<Goal>
  dailyActivity!: Table<DailyActivity>
  badges!: Table<Badge>
  tasks!: Table<Task>

  constructor() {
    super('ModoDatabase')

    this.version(1).stores({
      userProfile:   '++id',
      chatMessages:  '++id, role, timestamp',
      goals:         '++id, status, createdAt',
      dailyActivity: '++id, date',
      badges:        'id, earnedAt',
    })

    this.version(2).stores({
      userProfile:   '++id',
      chatMessages:  '++id, role, timestamp',
      goals:         '++id, status, createdAt',
      dailyActivity: '++id, date',
      badges:        'id, earnedAt',
      tasks:         '++id, date, type, completed',
    })
  }
}

export const db = new ModoDatabase()
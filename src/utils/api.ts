// src/utils/api.ts
// ─────────────────────────────────────
// ارتباط با بکند
// ─────────────────────────────────────

import type { ChatMessage, UserProfile } from './db'
import { getMockResponse } from './mockResponses'

const API_BASE = window.location.hostname === 'localhost'
  ? ''
  : 'https://modo-backend-cqn5.onrender.com'

// ─── تایپ Context ───
export interface ChatContext {
  streak: number
  todayTasksCompleted: number
  todayTasksTotal: number
  activeGoalsCount: number
  completedGoalsCount: number
}

// ─── ارسال پیام به AI ───
export async function sendMessageToAI(
  message: string,
  history: ChatMessage[],
  userProfile?: UserProfile,
  context?: ChatContext
): Promise<string> {
  try {
    const simpleHistory = history.map(msg => ({
      role: msg.role,
      content: msg.content,
    }))

    const simpleProfile = userProfile
      ? {
          name: userProfile.name,
          age: userProfile.age,
          status: userProfile.status,
          goals: userProfile.goals,
          sleepTime: userProfile.sleepTime,
          focusLevel: userProfile.focusLevel,
          screenTime: userProfile.screenTime,
        }
      : undefined

    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: simpleHistory,
        userProfile: simpleProfile,
        context: context || undefined,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `خطای سرور: ${response.status}`)
    }

    const data = await response.json()
    return data.reply

  } catch (error) {
    console.error('خطا در ارتباط با AI:', error)

    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('بکند در دسترس نیست. از پاسخ‌های ساختگی استفاده میشه.')
      return getMockResponse(message)
    }

    throw error
  }
}
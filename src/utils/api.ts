// src/utils/api.ts
// ─────────────────────────────────────
// ارتباط با بکند + Warmup
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

// ═══════════════════════════════════════
// Warmup — سرور Render رو بیدار کن
// ═══════════════════════════════════════

let isBackendWarm = false

export function warmupBackend(): void {
  if (isBackendWarm) return

  fetch(`${API_BASE}/api/ping`, { method: 'GET' })
    .then((res) => {
      if (res.ok) {
        isBackendWarm = true
        console.log('[MODO] Backend is warm and ready')
      }
    })
    .catch(() => {
      console.log('[MODO] Backend warming up...')
      // تلاش مجدد بعد از ۵ ثانیه
      setTimeout(() => {
        fetch(`${API_BASE}/api/ping`, { method: 'GET' })
          .then((res) => {
            if (res.ok) {
              isBackendWarm = true
              console.log('[MODO] Backend is warm (retry)')
            }
          })
          .catch(() => {
            console.log('[MODO] Backend still waking up...')
          })
      }, 5000)
    })
}

// ═══════════════════════════════════════
// ارسال پیام به AI
// ═══════════════════════════════════════

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

    // ─── Timeout: حداکثر ۶۰ ثانیه (برای cold start) ───
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000)

    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: simpleHistory,
        userProfile: simpleProfile,
        context: context || undefined,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `خطای سرور: ${response.status}`)
    }

    const data = await response.json()
    isBackendWarm = true
    return data.reply

  } catch (error) {
    console.error('خطا در ارتباط با AI:', error)

    // ─── Timeout ───
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('سرور خیلی طول کشید. دوباره تلاش کن.')
    }

    // ─── آفلاین / سرور خاموش ───
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('بکند در دسترس نیست. از پاسخ‌های ساختگی استفاده میشه.')
      return getMockResponse(message)
    }

    throw error
  }
}
// src/utils/api.ts
// ─────────────────────────────────────
// توابع ارتباط با بکند
// ─────────────────────────────────────

import type { ChatMessage, UserProfile } from './db'
import { getMockResponse } from './mockResponses'

// آدرس بکند - روش مطمئن‌تر
const API_BASE = window.location.hostname === 'localhost'
  ? ''  // لوکال: از proxy استفاده میکنه
  : 'https://modo-backend-cqn5.onrender.com'  // آنلاین

// ─── ارسال پیام به AI ───
export async function sendMessageToAI(
  message: string,
  history: ChatMessage[],
  userProfile?: UserProfile
): Promise<string> {
  try {
    // تبدیل تاریخچه به فرمت ساده
    const simpleHistory = history.map(msg => ({
      role: msg.role,
      content: msg.content,
    }))

    // تبدیل پروفایل به فرمت ساده
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

    // ─── ارسال به بکند ───
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: simpleHistory,
        userProfile: simpleProfile,
      }),
    })

    // ─── چک کردن خطا ───
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `خطای سرور: ${response.status}`)
    }

    // ─── دریافت پاسخ ───
    const data = await response.json()
    return data.reply

  } catch (error) {
    console.error('خطا در ارتباط با AI:', error)

    // ─── Fallback: اگه بکند کار نمیکنه → پاسخ ساختگی ───
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('بکند در دسترس نیست. از پاسخ‌های ساختگی استفاده میشه.')
      return getMockResponse(message)
    }

    // پیام خطای کاربرپسند
    throw error
  }
}
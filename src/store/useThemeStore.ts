// src/store/useThemeStore.ts
// ─────────────────────────────────────
// این فایل مسئول مدیریت تم (تاریک/روشن) هست
// از Zustand استفاده میکنیم - یه کتابخانه ساده برای نگهداری state
// ─────────────────────────────────────

import { create } from 'zustand'

// تعریف تایپ: چه داده‌ها و چه عملیاتی داریم
interface ThemeState {
  isDark: boolean          // آیا تم تاریکه؟
  toggleTheme: () => void  // تابع تغییر تم
}

// ─── تابع کمکی: تم ذخیره‌شده رو بخون ───
function getInitialTheme(): boolean {
  // اول چک کن آیا قبلاً تمی ذخیره شده
  const saved = localStorage.getItem('modo-theme')
  if (saved !== null) {
    return saved === 'dark'
  }
  // اگه ذخیره نشده → پیش‌فرض: تاریک
  return true
}

// ─── تابع کمکی: تم رو به صفحه اعمال کن ───
function applyTheme(isDark: boolean): void {
  // کلاس 'dark' رو به <html> اضافه یا حذف کن
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  // توی localStorage ذخیره کن (دفعه بعد یادش بمونه)
  localStorage.setItem('modo-theme', isDark ? 'dark' : 'light')
}

// ─── همین الان تم رو اعمال کن (وقتی فایل لود میشه) ───
const initialIsDark = getInitialTheme()
applyTheme(initialIsDark)

// ─── ساخت Store ───
export const useThemeStore = create<ThemeState>((set) => ({
  // مقدار اولیه
  isDark: initialIsDark,

  // تابع تغییر تم
  toggleTheme: () => {
    set((state) => {
      const newIsDark = !state.isDark  // برعکس کن
      applyTheme(newIsDark)            // به صفحه اعمال کن
      return { isDark: newIsDark }     // state رو آپدیت کن
    })
  },
}))
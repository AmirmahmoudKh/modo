// src/store/useThemeStore.ts
// ─────────────────────────────────────
// مدیریت تم (تاریک/روشن) + رنگ اکسنت
// ─────────────────────────────────────

import { create } from 'zustand'

// ─── تایپ رنگ‌های موجود ───
export type AccentColor = 'emerald' | 'blue' | 'purple' | 'rose' | 'amber'

interface ThemeState {
  isDark: boolean
  accentColor: AccentColor
  toggleTheme: () => void
  setAccentColor: (color: AccentColor) => void
}

// ─── مقدار اولیه تم ───
function getInitialTheme(): boolean {
  const saved = localStorage.getItem('modo-theme')
  if (saved !== null) return saved === 'dark'
  return true // پیش‌فرض: تاریک
}

// ─── مقدار اولیه رنگ ───
function getInitialAccent(): AccentColor {
  const saved = localStorage.getItem('modo-accent') as AccentColor | null
  if (saved && ['emerald', 'blue', 'purple', 'rose', 'amber'].includes(saved)) {
    return saved
  }
  return 'emerald' // پیش‌فرض: زمردی
}

// ─── اعمال تم به صفحه ───
function applyTheme(isDark: boolean): void {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('modo-theme', isDark ? 'dark' : 'light')
}

// ─── اعمال رنگ اکسنت ───
function applyAccent(color: AccentColor): void {
  document.documentElement.setAttribute('data-accent', color)
  localStorage.setItem('modo-accent', color)
}

// ─── اعمال اولیه ───
const initialIsDark = getInitialTheme()
const initialAccent = getInitialAccent()
applyTheme(initialIsDark)
applyAccent(initialAccent)

// ─── Store ───
export const useThemeStore = create<ThemeState>((set) => ({
  isDark: initialIsDark,
  accentColor: initialAccent,

  toggleTheme: () => {
    set((state) => {
      const newIsDark = !state.isDark
      applyTheme(newIsDark)
      return { isDark: newIsDark }
    })
  },

  setAccentColor: (color: AccentColor) => {
    applyAccent(color)
    set({ accentColor: color })
  },
}))
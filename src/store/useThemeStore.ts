// src/store/useThemeStore.ts
// ─────────────────────────────────────
// مدیریت تم + رنگ + صدا
// ─────────────────────────────────────

import { create } from 'zustand'

export type AccentColor = 'emerald' | 'blue' | 'purple' | 'rose' | 'amber'

interface ThemeState {
  isDark: boolean
  accentColor: AccentColor
  soundEnabled: boolean
  toggleTheme: () => void
  setAccentColor: (color: AccentColor) => void
  toggleSound: () => void
}

function getInitialTheme(): boolean {
  const saved = localStorage.getItem('modo-theme')
  if (saved !== null) return saved === 'dark'
  return true
}

function getInitialAccent(): AccentColor {
  const saved = localStorage.getItem('modo-accent') as AccentColor | null
  if (saved && ['emerald', 'blue', 'purple', 'rose', 'amber'].includes(saved)) return saved
  return 'emerald'
}

function getInitialSound(): boolean {
  return localStorage.getItem('modo-sound') !== 'off'
}

function applyTheme(isDark: boolean): void {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('modo-theme', isDark ? 'dark' : 'light')
}

function applyAccent(color: AccentColor): void {
  document.documentElement.setAttribute('data-accent', color)
  localStorage.setItem('modo-accent', color)
}

const initialIsDark = getInitialTheme()
const initialAccent = getInitialAccent()
applyTheme(initialIsDark)
applyAccent(initialAccent)

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: initialIsDark,
  accentColor: initialAccent,
  soundEnabled: getInitialSound(),

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

  toggleSound: () => {
    set((state) => {
      const newSound = !state.soundEnabled
      localStorage.setItem('modo-sound', newSound ? 'on' : 'off')
      return { soundEnabled: newSound }
    })
  },
}))
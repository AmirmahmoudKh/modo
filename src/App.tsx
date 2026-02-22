// src/App.tsx
// ─────────────────────────────────────
// فایل اصلی اپ MODO
// ─────────────────────────────────────

import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { hasCompletedOnboarding } from './utils/dbHelpers'

// صفحات
import Onboarding from './pages/Onboarding'
import Layout from './components/Layout'
import Home from './pages/Home'
import ChatPage from './pages/ChatPage'
import Goals from './pages/Goals'
import Progress from './pages/Progress'
import Settings from './pages/Settings'

// PWA کامپوننت‌ها
import InstallPrompt from './components/InstallPrompt'
import OfflineNotice from './components/OfflineNotice'

function App() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkOnboarding() {
      const completed = await hasCompletedOnboarding()
      setShowOnboarding(!completed)
    }
    checkOnboarding()
  }, [])

  // لودینگ
   if (showOnboarding === null) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center modo-btn-primary animate-breathe"
          style={{ fontSize: '1.5rem', fontWeight: 900 }}
        >
          M
        </div>

        <div className="text-3xl font-black modo-gradient-text">
          MODO
        </div>

        <div
          className="w-8 h-8 border-3 rounded-full animate-spin"
          style={{
            borderColor: 'var(--color-border)',
            borderTopColor: 'var(--color-accent)',
          }}
        />
      </div>
    )
  }

  // آنبوردینگ
  if (showOnboarding) {
    return (
      <Onboarding
        onComplete={() => setShowOnboarding(false)}
      />
    )
  }

  // اپ اصلی
  return (
    <BrowserRouter>
      {/* PWA: نوار آفلاین */}
      <OfflineNotice />

      {/* PWA: پیشنهاد نصب */}
      <InstallPrompt />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="goals" element={<Goals />} />
          <Route path="progress" element={<Progress />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
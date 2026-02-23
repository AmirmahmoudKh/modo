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
import EditProfile from './pages/EditProfile'

// PWA
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

  // ─── Splash Screen ───
  if (showOnboarding === null) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        {/* لوگو — بانس و درخشش */}
        <div className="animate-bounce-in">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center modo-btn-primary animate-breathe"
            style={{ fontSize: '2rem', fontWeight: 900 }}
          >
            M
          </div>
        </div>

        {/* نام — فید این با تاخیر */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="text-4xl font-black modo-gradient-text tracking-tight">
            MODO
          </div>
        </div>

        {/* شعار — فید این با تاخیر بیشتر */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            ساختار، وضوح، رشد
          </p>
        </div>

        {/* اسپینر — فید این آخر */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: '0.9s' }}
        >
          <div
            className="w-6 h-6 border-2 rounded-full animate-spin"
            style={{
              borderColor: 'var(--color-border)',
              borderTopColor: 'var(--color-accent)',
            }}
          />
        </div>
      </div>
    )
  }

  // ─── آنبوردینگ ───
  if (showOnboarding) {
    return (
      <Onboarding
        onComplete={() => setShowOnboarding(false)}
      />
    )
  }

  // ─── اپ اصلی ───
  return (
    <BrowserRouter>
      <OfflineNotice />
      <InstallPrompt />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="goals" element={<Goals />} />
          <Route path="progress" element={<Progress />} />
          <Route path="settings" element={<Settings />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
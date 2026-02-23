// src/App.tsx
// ─────────────────────────────────────
// فایل اصلی — Lazy loading + Error boundary
// ─────────────────────────────────────

import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { hasCompletedOnboarding } from './utils/dbHelpers'
import { startNotificationScheduler } from './utils/notifications'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'

// PWA
import InstallPrompt from './components/InstallPrompt'
import OfflineNotice from './components/OfflineNotice'

// ─── Lazy loading صفحات ───
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Home = lazy(() => import('./pages/Home'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const Goals = lazy(() => import('./pages/Goals'))
const Progress = lazy(() => import('./pages/Progress'))
const Settings = lazy(() => import('./pages/Settings'))
const EditProfile = lazy(() => import('./pages/EditProfile'))

// ─── لودینگ صفحات ───
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 border-3 rounded-full animate-spin"
          style={{
            borderColor: 'var(--color-border)',
            borderTopColor: 'var(--color-accent)',
          }}
        />
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          در حال بارگذاری...
        </p>
      </div>
    </div>
  )
}

function App() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkOnboarding() {
      const completed = await hasCompletedOnboarding()
      setShowOnboarding(!completed)

      if (completed) {
        startNotificationScheduler()
      }
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
        <div className="animate-bounce-in">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center modo-btn-primary animate-breathe"
            style={{ fontSize: '2rem', fontWeight: 900 }}
          >
            M
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="text-4xl font-black modo-gradient-text tracking-tight">
            MODO
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            ساختار، وضوح، رشد
          </p>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <div
            className="w-6 h-6 border-2 rounded-full animate-spin"
            style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-accent)' }}
          />
        </div>
      </div>
    )
  }

  // ─── آنبوردینگ ───
  if (showOnboarding) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Onboarding onComplete={() => {
            setShowOnboarding(false)
            startNotificationScheduler()
          }} />
        </Suspense>
      </ErrorBoundary>
    )
  }

  // ─── اپ اصلی ───
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <OfflineNotice />
        <InstallPrompt />

        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
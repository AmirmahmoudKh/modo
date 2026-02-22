// src/components/InstallPrompt.tsx
// ─────────────────────────────────────
// دکمه پیشنهاد نصب PWA
// ─────────────────────────────────────

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

// تایپ برای event نصب
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // چک کن آیا قبلاً dismiss شده
    const wasDismissed = localStorage.getItem('modo-install-dismissed')
    if (wasDismissed) return

    // گوش بده به event نصب
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as BeforeInstallPromptEvent)
      // ۳ ثانیه بعد از لود نشون بده
      setTimeout(() => setShowPrompt(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  // نصب
  const handleInstall = async () => {
    if (!installEvent) return
    await installEvent.prompt()
    const result = await installEvent.userChoice
    if (result.outcome === 'accepted') {
      setShowPrompt(false)
    }
  }

  // dismiss
  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('modo-install-dismissed', 'true')
  }

  // نشون نده اگه showPrompt نیست یا event نیست
  if (!showPrompt || !installEvent) return null

  return (
    <div
      className="fixed top-4 left-4 right-4 z-[90] rounded-2xl p-4 shadow-lg flex items-center gap-3"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-accent)',
        boxShadow: '0 4px 20px rgba(108, 99, 255, 0.3)',
      }}
    >
      {/* آیکون */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'var(--color-accent)' }}
      >
        <Download size={20} color="#FFFFFF" />
      </div>

      {/* متن */}
      <div className="flex-1">
        <p
          className="text-sm font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          MODO رو نصب کن!
        </p>
        <p
          className="text-xs"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          دسترسی سریع‌تر + کار بدون اینترنت
        </p>
      </div>

      {/* دکمه‌ها */}
      <button
        onClick={handleInstall}
        className="px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
        style={{
          backgroundColor: 'var(--color-accent)',
          color: '#FFFFFF',
        }}
      >
        نصب
      </button>

      <button
        onClick={handleDismiss}
        className="p-1 rounded-lg transition-all active:scale-90"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <X size={18} />
      </button>
    </div>
  )
}
// src/components/OfflineNotice.tsx
// ─────────────────────────────────────
// نوار اطلاع‌رسانی وقتی اینترنت قطعه
// ─────────────────────────────────────

import { useState, useEffect } from 'react'
import { WifiOff } from 'lucide-react'

export default function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => setIsOffline(false)

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center gap-2 py-2 px-4"
      style={{
        backgroundColor: 'var(--color-warning)',
        color: '#000000',
      }}
    >
      <WifiOff size={14} />
      <span className="text-xs font-medium">
        اینترنت قطعه — چت با MODO فعلاً کار نمیکنه
      </span>
    </div>
  )
}
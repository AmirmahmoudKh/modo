// src/components/Layout.tsx
// ─────────────────────────────────────
// قالب اصلی اپ
// هر صفحه‌ای که باز بشه، داخل این قالب نمایش داده میشه
// ─────────────────────────────────────

import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

// Outlet: جایی که محتوای صفحه فعلی نمایش داده میشه
// مثلاً اگه آدرس /chat باشه → صفحه ChatPage اینجا لود میشه

export default function Layout() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* محتوای صفحه */}
      {/* pb-20: فاصله از پایین تا نوار ناوبری روش نیفته */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>

      {/* نوار ناوبری پایین */}
      <BottomNav />
    </div>
  )
}
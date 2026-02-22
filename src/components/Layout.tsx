// src/components/Layout.tsx

import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function Layout() {
  const location = useLocation()

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* محتوای صفحه با انیمیشن */}
      <main
        key={location.pathname}
        className="flex-1 pb-20 overflow-y-auto page-enter"
      >
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
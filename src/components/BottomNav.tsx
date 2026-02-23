// src/components/BottomNav.tsx
// ─────────────────────────────────────
// نوار ناوبری پایین — Glassmorphism
// ─────────────────────────────────────

import { useLocation, useNavigate } from 'react-router-dom'
import { Home, MessageCircle, Target, BarChart3, Settings } from 'lucide-react'

const navItems = [
  { path: '/',         icon: Home,          label: 'خانه' },
  { path: '/chat',     icon: MessageCircle, label: 'چت' },
  { path: '/goals',    icon: Target,        label: 'اهداف' },
  { path: '/progress', icon: BarChart3,     label: 'پیشرفت' },
  { path: '/settings', icon: Settings,      label: 'تنظیمات' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 border-t z-50 modo-glass"
      style={{
        backgroundColor: 'var(--color-nav-bg)',
        borderColor: 'var(--color-glass-border)',
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        const Icon = item.icon

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-4 rounded-2xl transition-all duration-300 active:scale-90 relative"
          >
            {/* پس‌زمینه درخشان برای آیتم فعال */}
            <div
              className="absolute inset-1 rounded-2xl transition-all duration-300"
              style={{
                backgroundColor: isActive ? 'var(--color-accent-glow)' : 'transparent',
                transform: isActive ? 'scale(1)' : 'scale(0.5)',
                opacity: isActive ? 1 : 0,
              }}
            />

            {/* آیکون */}
            <div className="relative z-10 transition-transform duration-300"
              style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)' }}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  transition: 'color 0.3s ease',
                }}
              />
            </div>

            {/* لیبل */}
            <span
              className="text-[10px] font-medium relative z-10 transition-colors duration-300"
              style={{
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              }}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
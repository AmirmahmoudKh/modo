// src/components/BottomNav.tsx

import { useLocation, useNavigate } from 'react-router-dom'
import { Home, MessageCircle, Target, BarChart3, Settings } from 'lucide-react'

const navItems = [
  { path: '/',         icon: Home,           label: 'خانه' },
  { path: '/chat',     icon: MessageCircle,  label: 'چت' },
  { path: '/goals',    icon: Target,         label: 'اهداف' },
  { path: '/progress', icon: BarChart3,      label: 'پیشرفت' },
  { path: '/settings', icon: Settings,       label: 'تنظیمات' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 border-t z-50 modo-glass"
      style={{
        backgroundColor: 'var(--color-nav-bg)',
        borderColor: 'var(--color-border)',
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        const Icon = item.icon

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-300 active:scale-90 relative"
          >
            {/* خط فعال بالا */}
            <div
              className="absolute -top-[1px] h-[3px] rounded-full transition-all duration-300"
              style={{
                backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                width: isActive ? '24px' : '0px',
                boxShadow: isActive ? '0 0 8px var(--color-accent-glow)' : 'none',
              }}
            />

            {/* آیکون */}
            <div
              className="p-1.5 rounded-xl transition-all duration-300"
              style={{
                backgroundColor: isActive ? 'var(--color-accent-glow)' : 'transparent',
              }}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.5}
                style={{
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  transition: 'color 0.3s ease',
                }}
              />
            </div>

            {/* لیبل */}
            <span
              className="text-[10px] font-medium transition-all duration-300"
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
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
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 border-t z-50"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)',
        boxShadow: '0 -2px 10px var(--color-shadow)',
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        const Icon = item.icon

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200 active:scale-95 relative"
            style={{
              color: isActive
                ? 'var(--color-accent)'
                : 'var(--color-text-secondary)',
            }}
          >
            {/* نقطه فعال */}
            {isActive && (
              <div
                className="absolute -top-1 w-6 h-1 rounded-full"
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
            )}

            <div
              className="p-1 rounded-lg transition-all"
              style={{
                backgroundColor: isActive ? 'var(--color-accent-glow)' : 'transparent',
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
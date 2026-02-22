// src/components/BottomNav.tsx
// ─────────────────────────────────────
// نوار ناوبری پایین صفحه (مثل اینستاگرام)
// ۵ تا دکمه: خانه، چت، اهداف، پیشرفت، تنظیمات
// ─────────────────────────────────────

import { useLocation, useNavigate } from 'react-router-dom'
import { Home, MessageCircle, Target, BarChart3, Settings } from 'lucide-react'

// تعریف آیتم‌های ناوبری
const navItems = [
  { path: '/',         icon: Home,           label: 'خانه' },
  { path: '/chat',     icon: MessageCircle,  label: 'چت' },
  { path: '/goals',    icon: Target,         label: 'اهداف' },
  { path: '/progress', icon: BarChart3,      label: 'پیشرفت' },
  { path: '/settings', icon: Settings,       label: 'تنظیمات' },
]

export default function BottomNav() {
  // useLocation: میگه الان کجای اپ هستیم
  const location = useLocation()
  // useNavigate: برای رفتن به صفحه دیگه
  const navigate = useNavigate()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 border-t z-50"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)',
      }}
    >
      {navItems.map((item) => {
        // چک کن آیا این آیتم صفحه فعلی هست
        const isActive = location.pathname === item.path
        const Icon = item.icon

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200 active:scale-95"
            style={{
              color: isActive
                ? 'var(--color-accent)'       // بنفش اگه فعاله
                : 'var(--color-text-secondary)' // خاکستری اگه غیرفعاله
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
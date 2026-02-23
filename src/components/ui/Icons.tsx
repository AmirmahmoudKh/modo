// src/components/ui/Icons.tsx
// ─────────────────────────────────────
// سیستم مپ ایموجی → آیکون Lucide
// ─────────────────────────────────────

import {
  Sunrise,
  Compass,
  Brain,
  Moon,
  BookOpen,
  Heart,
  Smartphone,
  Clock,
  Pin,
  CircleCheck,
  MessageCircle,
  Target,
  ClipboardList,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  '🌅': Sunrise,
  '🧭': Compass,
  '🧠': Brain,
  '🌙': Moon,
  '📖': BookOpen,
  '💚': Heart,
  '📵': Smartphone,
  '⏰': Clock,
  '📌': Pin,
  '✅': CircleCheck,
  '💬': MessageCircle,
  '🎯': Target,
  '📋': ClipboardList,
  '✨': Sparkles,
  '⚡': Zap,
}

interface TaskIconProps {
  emoji: string
  size?: number
  color?: string
  className?: string
}

export function TaskIcon({ emoji, size = 18, color, className }: TaskIconProps) {
  const Icon = ICON_MAP[emoji]
  if (Icon) {
    return (
      <Icon
        size={size}
        style={{ color: color || 'var(--color-accent)' }}
        className={className}
      />
    )
  }
  return (
    <Zap
      size={size}
      style={{ color: color || 'var(--color-accent)' }}
      className={className}
    />
  )
}
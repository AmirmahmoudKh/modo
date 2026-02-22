// src/components/ui/Icons.tsx
// ─────────────────────────────────────
// آیکون‌های سفارشی MODO
// بجای ایموجی از اینا استفاده میکنیم
// ─────────────────────────────────────

import {
  Flame,
  Target,
  CheckCircle2,
  MessageCircle,
  Calendar,
  Trophy,
  Lock,
  Zap,
  Archive,
  Moon,
  Brain,
  Smartphone,
  BookOpen,
  Dumbbell,
  Pen,
  Clock,
  TrendingUp,
  Coffee,
  type LucideProps,
} from 'lucide-react'

// ─── آیکون Streak (آتش) ───
export function StreakIcon(props: LucideProps) {
  return <Flame {...props} />
}

// ─── آیکون هدف ───
export function GoalIcon(props: LucideProps) {
  return <Target {...props} />
}

// ─── آیکون تکمیل ───
export function CompletedIcon(props: LucideProps) {
  return <CheckCircle2 {...props} />
}

// ─── آیکون چت ───
export function ChatIcon(props: LucideProps) {
  return <MessageCircle {...props} />
}

// ─── آیکون تقویم ───
export function CalendarIcon(props: LucideProps) {
  return <Calendar {...props} />
}

// ─── آیکون نشان/جایزه ───
export function BadgeIcon(props: LucideProps) {
  return <Trophy {...props} />
}

// ─── آیکون قفل ───
export function LockIcon(props: LucideProps) {
  return <Lock {...props} />
}

// ─── آیکون فعال ───
export function ActiveIcon(props: LucideProps) {
  return <Zap {...props} />
}

// ─── آیکون آرشیو ───
export function ArchiveIcon(props: LucideProps) {
  return <Archive {...props} />
}

// ─── آیکون خواب ───
export function SleepIcon(props: LucideProps) {
  return <Moon {...props} />
}

// ─── آیکون تمرکز ───
export function FocusIcon(props: LucideProps) {
  return <Brain {...props} />
}

// ─── آیکون اسکرین تایم ───
export function ScreenIcon(props: LucideProps) {
  return <Smartphone {...props} />
}

// ─── آیکون مطالعه ───
export function ReadIcon(props: LucideProps) {
  return <BookOpen {...props} />
}

// ─── آیکون ورزش ───
export function ExerciseIcon(props: LucideProps) {
  return <Dumbbell {...props} />
}

// ─── آیکون نوشتن ───
export function WriteIcon(props: LucideProps) {
  return <Pen {...props} />
}

// ─── آیکون زمان ───
export function TimeIcon(props: LucideProps) {
  return <Clock {...props} />
}

// ─── آیکون پیشرفت ───
export function ProgressIcon(props: LucideProps) {
  return <TrendingUp {...props} />
}

// ─── آیکون انرژی ───
export function EnergyIcon(props: LucideProps) {
  return <Coffee {...props} />
}
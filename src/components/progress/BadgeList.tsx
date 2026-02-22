// src/components/progress/BadgeList.tsx

import { Trophy, Lock, Sprout, MessageCircle, Target, Zap, Flame, Star, Crown, Award } from 'lucide-react'
import { ALL_BADGES } from '../../utils/dbHelpers'
import type { Badge } from '../../utils/db'

interface BadgeListProps {
  earnedBadges: Badge[]
}

// مپ آیکون‌ها به badge id
const BADGE_ICONS: Record<string, typeof Trophy> = {
  'first_step': Sprout,
  'first_chat': MessageCircle,
  'first_goal': Target,
  'goal_crusher': Zap,
  'three_days': Flame,
  'one_week': Star,
  'two_weeks': Award,
  'one_month': Crown,
}

export default function BadgeList({ earnedBadges }: BadgeListProps) {
  const earnedIds = earnedBadges.map(b => b.id)

  return (
    <div className="modo-card">
      {/* هدر */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={18} style={{ color: 'var(--color-accent)' }} />
          <p
            className="text-sm font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            نشان‌ها
          </p>
        </div>
        <p
          className="text-xs"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {earnedBadges.length} از {ALL_BADGES.length}
        </p>
      </div>

      {/* لیست */}
      <div className="space-y-2">
        {ALL_BADGES.map((badge, index) => {
          const isEarned = earnedIds.includes(badge.id)
          const earnedBadge = earnedBadges.find(b => b.id === badge.id)
          const BadgeIconComp = BADGE_ICONS[badge.id] || Trophy

          return (
            <div
              key={badge.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all animate-fade-in stagger-${Math.min(index + 1, 5)}`}
              style={{
                backgroundColor: isEarned
                  ? 'var(--color-accent-light)'
                  : 'var(--color-bg-tertiary)',
                opacity: isEarned ? 1 : 0.5,
              }}
            >
              {/* آیکون */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: isEarned
                    ? 'var(--color-accent-glow)'
                    : 'var(--color-bg-secondary)',
                }}
              >
                {isEarned ? (
                  <BadgeIconComp
                    size={20}
                    style={{ color: 'var(--color-accent)' }}
                  />
                ) : (
                  <Lock
                    size={16}
                    style={{ color: 'var(--color-text-secondary)' }}
                  />
                )}
              </div>

              {/* متن */}
              <div className="flex-1">
                <p
                  className="text-sm font-bold"
                  style={{
                    color: isEarned
                      ? 'var(--color-text-primary)'
                      : 'var(--color-text-secondary)',
                  }}
                >
                  {badge.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {badge.description}
                </p>
              </div>

              {/* وضعیت */}
              {isEarned ? (
                <div className="text-left">
                  <span
                    className="text-[10px] font-bold flex items-center gap-1"
                    style={{ color: 'var(--color-success)' }}
                  >
                    <Zap size={10} />
                    کسب شده
                  </span>
                  {earnedBadge?.earnedAt && (
                    <p
                      className="text-[9px]"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {new Date(earnedBadge.earnedAt).toLocaleDateString('fa-IR')}
                    </p>
                  )}
                </div>
              ) : (
                <Lock
                  size={14}
                  style={{ color: 'var(--color-text-secondary)' }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
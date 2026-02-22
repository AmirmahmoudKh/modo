// src/components/progress/BadgeList.tsx
// ─────────────────────────────────────
// لیست نشان‌ها (کسب شده + قفل)
// ─────────────────────────────────────

import { ALL_BADGES } from '../../utils/dbHelpers'
import type { Badge } from '../../utils/db'

interface BadgeListProps {
  earnedBadges: Badge[]
}

export default function BadgeList({ earnedBadges }: BadgeListProps) {

  // لیست ID های کسب شده
  const earnedIds = earnedBadges.map(b => b.id)

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* هدر */}
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-sm font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          🏆 نشان‌ها
        </p>
        <p
          className="text-xs"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {earnedBadges.length} از {ALL_BADGES.length}
        </p>
      </div>

      {/* لیست */}
      <div className="space-y-3">
        {ALL_BADGES.map((badge) => {
          const isEarned = earnedIds.includes(badge.id)
          const earnedBadge = earnedBadges.find(b => b.id === badge.id)

          return (
            <div
              key={badge.id}
              className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{
                backgroundColor: isEarned
                  ? 'var(--color-accent-light)'
                  : 'var(--color-bg-tertiary)',
                opacity: isEarned ? 1 : 0.5,
              }}
            >
              {/* آیکون */}
              <span className="text-2xl">
                {isEarned ? badge.icon : '🔒'}
              </span>

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
                    className="text-[10px] font-bold"
                    style={{ color: 'var(--color-success)' }}
                  >
                    ✅ کسب شده
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
                <span
                  className="text-[10px]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  🔒 قفل
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
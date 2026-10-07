import type { PointsBreakdown } from '../types/challenge-view'

export const POINT_TIERS = [
  { key: 'count5Pts', label: '5 pts', color: 'bg-seg-5' },
  { key: 'count3Pts', label: '3 pts', color: 'bg-seg-3' },
  { key: 'count2Pts', label: '2 pts', color: 'bg-seg-2' },
  { key: 'count1Pts', label: '1 pt', color: 'bg-seg-1' },
  { key: 'count0Pts', label: '0 pt', color: 'bg-seg-0' },
] as const

export const breakdownCounts = (breakdown?: Partial<PointsBreakdown> | null) =>
  POINT_TIERS.map((tier) => breakdown?.[tier.key] ?? 0)

export const matchesPlayed = (breakdown?: Partial<PointsBreakdown> | null) =>
  breakdownCounts(breakdown).reduce((sum, count) => sum + count, 0)

/** Share of each tier (in %), relative to the matches played or to the largest tier. */
export const breakdownTiers = (
  breakdown?: Partial<PointsBreakdown> | null,
  relativeTo: 'total' | 'max' = 'total',
) => {
  const counts = breakdownCounts(breakdown)
  const base =
    relativeTo === 'max'
      ? Math.max(...counts)
      : counts.reduce((sum, count) => sum + count, 0)
  return POINT_TIERS.map((tier, index) => ({
    ...tier,
    count: counts[index],
    percent: base > 0 ? (counts[index] / base) * 100 : 0,
  }))
}

/** A match without a single point counts as a defeat, as on the historical Top 6 site. */
export const winLoss = (breakdown?: Partial<PointsBreakdown> | null) => {
  const played = matchesPlayed(breakdown)
  const losses = breakdown?.count0Pts ?? 0
  const wins = played - losses
  return {
    played,
    wins,
    losses,
    rate: played > 0 ? Math.round((wins / played) * 100) : 0,
  }
}

const decimal = new Intl.NumberFormat('fr-BE', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export const averagePoints = (total: number, played: number) =>
  played > 0 ? decimal.format(total / played) : '–'

/** "GODEFROID ANNE-CATHERINE" → "Godefroid Anne-Catherine" */
export const displayName = (name: string) =>
  name
    .toLocaleLowerCase('fr-BE')
    .replace(/(^|[\s'-])(\p{L})/gu, (_, sep: string, letter: string) => sep + letter.toLocaleUpperCase('fr-BE'))

export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase('fr-BE'))
    .join('')

const SHORT_LEVEL_LABELS: Record<string, string> = { NAT_WB: 'National WB' }

export const levelShortLabel = (code: string, label?: string) =>
  SHORT_LEVEL_LABELS[code] ?? label ?? code

import type { AISummary } from '../types/challenge-view'

export interface RegionInsights {
  summary: string
  highlights: string[]
  risingPlayers: string[]
  dominantClubs: string[]
  competitiveLevel?: string
}

const strings = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim() !== '')
    : []

/** The API stores the AI summary as free JSON: keep only the fields the page can render. */
export const regionInsights = (raw?: Partial<AISummary> | Record<string, unknown> | null): RegionInsights | null => {
  if (!raw || typeof raw !== 'object') return null
  const source = raw as Record<string, unknown>
  const trends = (source.trends && typeof source.trends === 'object' ? source.trends : {}) as Record<string, unknown>
  const summary =
    (typeof source.summary === 'string' && source.summary.trim()) ||
    (typeof trends.weeklyInsight === 'string' && trends.weeklyInsight.trim()) ||
    ''
  const insights: RegionInsights = {
    summary,
    highlights: strings(source.keyHighlights),
    risingPlayers: strings(trends.risingPlayers),
    dominantClubs: strings(trends.dominantClubs),
    competitiveLevel: typeof trends.competitiveLevel === 'string' ? trends.competitiveLevel : undefined,
  }
  const empty =
    !insights.summary &&
    insights.highlights.length === 0 &&
    insights.risingPlayers.length === 0 &&
    insights.dominantClubs.length === 0
  return empty ? null : insights
}

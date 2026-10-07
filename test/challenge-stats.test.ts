import { describe, expect, it } from 'vitest'
import {
  averagePoints,
  breakdownTiers,
  displayName,
  initials,
  matchesPlayed,
  winLoss,
} from '../app/utils/challenge-stats'
import { regionPath, regionSlug } from '../app/utils/challenge-navigation'

const gonay = { count5Pts: 14, count3Pts: 4, count2Pts: 1, count1Pts: 0, count0Pts: 1 }

describe('challenge stats', () => {
  it('counts matches and wins from the points breakdown', () => {
    expect(matchesPlayed(gonay)).toBe(20)
    expect(winLoss(gonay)).toEqual({ played: 20, wins: 19, losses: 1, rate: 95 })
    expect(winLoss(undefined)).toEqual({ played: 0, wins: 0, losses: 0, rate: 0 })
  })

  it('computes tier shares against the total or the largest tier', () => {
    const total = breakdownTiers(gonay)
    expect(total.map((tier) => tier.percent)).toEqual([70, 20, 5, 0, 5])
    expect(breakdownTiers(gonay, 'max')[0].percent).toBe(100)
    expect(breakdownTiers(null).every((tier) => tier.percent === 0)).toBe(true)
  })

  it('formats averages the Belgian way', () => {
    expect(averagePoints(84, 20)).toBe('4,2')
    expect(averagePoints(10, 0)).toBe('–')
  })

  it('turns uppercase TabT names into readable names', () => {
    expect(displayName('GODEFROID ANNE-CATHERINE')).toBe('Godefroid Anne-Catherine')
    expect(displayName('BEGASSE DE DHAEM PIERRE')).toBe('Begasse De Dhaem Pierre')
    expect(initials('GONAY THIBAUT')).toBe('GT')
  })

  it('builds region paths from region codes', () => {
    expect(regionSlug('HUY_WAREMME')).toBe('huy-waremme')
    expect(regionPath('challenge-provincial', 'LIEGE')).toBe(
      '/challenges/challenge-provincial/region/liege',
    )
  })
})

describe('region insights', () => {
  it('keeps only renderable AI summary fields', async () => {
    const { regionInsights } = await import('../app/utils/ai-summary')
    expect(regionInsights(null)).toBeNull()
    expect(regionInsights({ trends: {} })).toBeNull()
    expect(
      regionInsights({
        summary: 'Semaine animée',
        keyHighlights: ['A', '', 3],
        trends: { risingPlayers: ['GASPAR ROMAIN'], dominantClubs: 'TT Ans', competitiveLevel: 'Élevé' },
      }),
    ).toEqual({
      summary: 'Semaine animée',
      highlights: ['A'],
      risingPlayers: ['GASPAR ROMAIN'],
      dominantClubs: [],
      competitiveLevel: 'Élevé',
    })
  })
})

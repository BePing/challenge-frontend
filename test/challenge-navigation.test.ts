import { describe, expect, it } from 'vitest'
import {
  challengePath,
  challengePublicationState,
  singleChallengePath,
} from '../app/utils/challenge-navigation'
import type { ChallengeSummary } from '../app/types/challenge'

const challenge = (slug: string, nextPublicationAt?: string): ChallengeSummary => ({
  slug,
  name: slug,
  unofficial: true,
  unofficialLabel: 'Classement non officiel',
  displayOrder: 0,
  regions: [],
  levels: [],
  nextPublicationAt,
})

describe('challenge navigation and publication state', () => {
  it('redirects only when one challenge is active', () => {
    expect(singleChallengePath([challenge('provincial')])).toBe(
      '/challenges/provincial',
    )
    expect(singleChallengePath([challenge('a'), challenge('b')])).toBeNull()
  })

  it('switches challenges through their stable slug', () => {
    expect(challengePath('challenge-liege')).toBe('/challenges/challenge-liege')
    expect(challengePath('nom avec espaces')).toBe(
      '/challenges/nom%20avec%20espaces',
    )
  })

  it('represents the first publication state', () => {
    expect(challengePublicationState(challenge('new'), null)).toEqual({
      kind: 'first-publication-pending',
    })
  })

  it('keeps the Monday result private while showing Thursday as next publication', () => {
    const nextPublicationAt = '2026-10-08T06:00:00.000Z'
    expect(
      challengePublicationState(
        challenge('provincial', nextPublicationAt),
        null,
      ),
    ).toEqual({ kind: 'scheduled', nextPublicationAt })
  })
})

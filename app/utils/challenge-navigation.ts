import type { ChallengePublication, ChallengeSummary } from '../types/challenge'

export const challengePath = (slug: string) =>
  `/challenges/${encodeURIComponent(slug)}`

export const singleChallengePath = (challenges: ChallengeSummary[]) =>
  challenges.length === 1 ? challengePath(challenges[0].slug) : null

export const challengePublicationState = (
  challenge: ChallengeSummary,
  publication: ChallengePublication | null,
) => {
  if (publication) {
    return { kind: 'published' as const, week: publication.week }
  }
  return challenge.nextPublicationAt
    ? {
        kind: 'scheduled' as const,
        nextPublicationAt: challenge.nextPublicationAt,
      }
    : { kind: 'first-publication-pending' as const }
}

export const regionSlug = (code: string) => code.toLowerCase().replace(/_/g, '-')

export const regionPath = (slug: string, regionCode: string) =>
  `${challengePath(slug)}/region/${regionSlug(regionCode)}`

export interface ChallengeOption {
  code: string
  label: string
}

export interface ChallengeSummary {
  slug: string
  name: string
  shortName?: string
  description?: string
  unofficial: boolean
  unofficialLabel: string
  displayOrder: number
  activeSeason?: number
  nextPublicationAt?: string
  regions: ChallengeOption[]
  levels: ChallengeOption[]
}

export interface ChallengePublication {
  challengeSlug: string
  challengeName: string
  season: number
  week: number
  publishedAt: string
  checksum: string
  totalPlayers: number
}

export interface ChallengeRanking {
  challengeSlug: string
  challengeName: string
  unofficial: boolean
  unofficialLabel: string
  season: number
  week: number
  playerUniqueIndex: number
  playerName: string
  clubIndex: string
  clubName: string
  regionCode: string
  regionLabel: string
  levelCode: string
  levelLabel: string
  position: number
  totalParticipants: number
  points: number
  breakdown: {
    count5Pts: number
    count3Pts: number
    count2Pts: number
    count1Pts: number
    count0Pts: number
  }
  publishedAt: string
}

export interface ChallengeRankingPage {
  publication?: ChallengePublication
  items: ChallengeRanking[]
  nextCursor?: string
}

export interface ChallengeRegionSummary {
  challengeSlug: string
  challengeName: string
  season: number
  week: number
  regionCode: string
  regionLabel: string
  totalPlayers: number
  playersByLevel: Record<string, number>
  clubs: string[]
  aiSummary?: Record<string, unknown>
  publishedAt: string
}

export interface ChallengePlayerPoint {
  matchUniqueId: number
  matchId: string
  divisionId: number
  week: number
  levelCode: string
  victoryCount: number
  forfeit: number
  pointsWon: number
}

export interface ChallengePlayerResponse {
  hasRanking: boolean
  rankings: ChallengeRanking[]
  points: ChallengePlayerPoint[]
}

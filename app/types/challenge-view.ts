// View-model types used by the generic challenge components.

export interface PointsBreakdown {
  count5Pts: number;
  count3Pts: number;
  count2Pts: number;
  count1Pts: number;
  count0Pts: number;
}

export interface PlayerPosition {
  uniqueIndex: string;
  clubIndex: string;
  clubName: string;
  name: string;
  points: {
    total: number;
    count5Pts?: number;
    count3Pts?: number;
    count2Pts?: number;
    count1Pts?: number;
    count0Pts?: number;
    breakdown?: PointsBreakdown;
  };
  position: number;
}

export interface AISummary {
  region: string;
  weekName: number;
  summary: string;
  keyHighlights: string[];
  topPerformers: Array<{
    name: string;
    club: string;
    level: string;
    achievement: string;
  }>;
  trends: {
    risingPlayers: string[];
    dominantClubs: string[];
    competitiveLevel: 'Élevé' | 'Modéré' | 'Faible';
    weeklyInsight: string;
  };
  generatedAt: Date;
}

export interface RegionSummary {
  region: string;
  totalPlayers: number;
  playersByLevel: Record<string, number>;
  topPlayersByLevel: Record<string, PlayerPosition[]>;
  clubs: string[];
  lastUpdated: Date;
  aiSummary?: AISummary;
}

export interface RankingDocument {
  uniqueIndex: number;
  name: string;
  clubIndex: string;
  clubName: string;
  region: string;
  level: string;
  position: number;
  points: {
    total: number;
    breakdown: PointsBreakdown;
  };
  weekName: number;
  lastUpdated: Date;
}

export interface PlayerPoint {
  divisionId: number;
  weekName: number;
  level: string;
  victoryCount: number;
  forfeit: number;
  pointsWon: number;
  matchId: string;
  matchUniqueId: number;
}

export interface PlayerPointsHistory {
  points: number;
  level: string;
  position: number;
  weekName: number;
}

export interface PlayerPointsDetails {
  name: string;
  club: string;
  points: PlayerPoint[];
  levelAttributed: string;
  history: PlayerPointsHistory[];
  lastUpdated: Date;
  weekName: number;
}

export interface ComputationMetadata {
  timestamp: Date;
  weekName: number;
  version: string;
  totalPlayersProcessed: number;
  regionsProcessed: string[];
  levelsProcessed: string[];
}

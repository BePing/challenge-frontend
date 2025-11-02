# Championship Rankings Frontend - Firebase Firestore Integration Guide

## Application Overview
Create a fullstack Nuxt application to display championship table tennis rankings using Firebase Firestore Web SDK for direct client-side data fetching. The app features region selection, level filtering, player lists, and detailed player statistics.

## Data Architecture

### Firestore Collection Structure

The backend uses Firebase/Firestore with the following optimized collections:

#### 1. `/tops` Collection
**Purpose**: Hierarchical ranking structure by region and level
**Document ID Pattern**: `{region}` (e.g., "LIEGE", "HUY_WAREMME", "VERVIERS")

**Document Structure**:
```typescript
{
  clubs: string[];                    // Array of club unique indices
  levels: {                          // Object keyed by level name
    [level: string]: PlayerPosition[] // Array of players for each level
  };
  lastUpdated: Date;                  // Last update timestamp
  weekName: number;                   // Current week number
}
```

**PlayerPosition Structure**:
```typescript
{
  uniqueIndex: string;                 // Player's unique identifier
  clubIndex: string;                  // Club unique index
  clubName: string;                   // Full club name
  name: string;                        // Player full name
  points: {                           // Points breakdown
    total: number;                     // Total points
    count5Pts: number;                 // Number of 5-point matches
    count3Pts: number;                 // Number of 3-point matches
    count2Pts: number;                 // Number of 2-point matches
    count1Pts: number;                 // Number of 1-point matches
    count0Pts: number;                 // Number of 0-point matches
  };
  position: number;                    // Position in ranking (0-indexed)
}
```

**Use Cases**:
- Legacy hierarchical structure access
- Quick region-level data retrieval
- Complete level-based player lists

#### 2. `/region-summaries` Collection
**Purpose**: Main dashboard data with AI-generated insights
**Document ID Pattern**: `{region}-week-{weekName}` (e.g., "LIEGE-week-12")

**Document Structure**:
```typescript
{
  region: string;                      // Region name (TOP_REGIONS enum value)
  totalPlayers: number;               // Total players in region
  playersByLevel: {                    // Player count per level
    [level: string]: number;
  };
  topPlayersByLevel: {                // Top 10 players per level
    [level: string]: PlayerPosition[];
  };
  clubs: string[];                     // Array of club unique indices
  lastUpdated: Date;                   // Last update timestamp
  aiSummary?: AISummary;               // AI-generated summary (optional)
}
```

**AISummary Structure**:
```typescript
{
  region: string;                      // Region name
  weekName: number;                   // Week number
  summary: string;                     // Main summary text (2-3 sentences)
  keyHighlights: string[];             // Array of key highlight points
  topPerformers: Array<{               // Top performing players
    name: string;
    club: string;
    level: string;
    achievement: string;
  }>;
  trends: {
    risingPlayers: string[];           // Players rising in rankings
    dominantClubs: string[];           // Clubs with strong performance
    competitiveLevel: string;            // "Élevé" | "Modéré" | "Faible"
    weeklyInsight: string;              // Weekly insight text
  };
  generatedAt: Date;                   // When AI summary was generated
}
```

**Use Cases**:
- Initial page load to show region overview
- Display AI insights and key highlights
- Quick access to top performers
- Level selector with player counts

#### 3. `/rankings` Collection (Flattened Structure)
**Purpose**: Complete player rankings optimized for filtering and querying
**Document ID Pattern**: `{weekName}-{region}-{level}-{uniqueIndex}` (sanitized - invalid characters replaced with underscores)

**Document Structure**:
```typescript
{
  uniqueIndex: string;                 // Player's unique identifier
  name: string;                        // Player full name
  clubIndex: string;                   // Club unique index
  clubName: string;                    // Full club name
  region: string;                      // Region name (TOP_REGIONS enum value)
  level: string;                        // Level name (TOP_LEVEL enum value)
  position: number;                     // Position in ranking (1-indexed)
  points: {
    total: number;                      // Total points
    breakdown: {
      count5Pts: number;                // Number of 5-point matches
      count3Pts: number;                // Number of 3-point matches
      count2Pts: number;                // Number of 2-point matches
      count1Pts: number;                // Number of 1-point matches
      count0Pts: number;                // Number of 0-point matches
    };
  };
  weekName: number;                     // Week number
  lastUpdated: Date;                   // Last update timestamp
}
```

**Note**: Document IDs are sanitized to replace invalid Firestore characters (`/ \ . # [ ] *`) with underscores.

**Use Cases**:
- Display complete player lists for a specific level
- Search and filter players
- Sort by points or position
- Pagination for large lists
- Efficient querying with composite indexes

#### 4. `/players-points-details` Collection
**Purpose**: Detailed player statistics and match history
**Document ID Pattern**: `{uniqueIndex}` (player's unique identifier)

**Document Structure**:
```typescript
{
  name: string;                         // Player full name
  club: string;                         // Club unique index
  points: PlayerPoint[];                // Array of match points
  levelAttributed: string;              // Current level (TOP_LEVEL enum value)
  history: PlayerPointsHistory[];       // Historical ranking data
  lastUpdated: Date;                    // Last update timestamp
  weekName: number;                     // Current week number
}
```

**PlayerPoint Structure**:
```typescript
{
  divisionId: number;                   // Division ID
  weekName: number;                     // Week number
  level: string;                        // Level name (TOP_LEVEL enum value)
  victoryCount: number;                 // Number of victories
  forfeit: number;                      // Number of forfeits
  pointsWon: number;                    // Points earned this match
  matchId: string;                      // Match identifier
  matchUniqueId: number;                // Match unique ID
}
```

**PlayerPointsHistory Structure**:
```typescript
{
  points: number;                       // Total points at this week
  level: string;                        // Level name
  position: number;                     // Position in ranking
  weekName: number;                     // Week number
}
```

**Use Cases**:
- Player detail modal/page
- Performance analysis and trends
- Match-by-match breakdown
- Historical comparisons
- Level attribution tracking

#### 5. `/computation-metadata` Collection
**Purpose**: System metadata and processing information
**Document ID Pattern**: `week-{weekName}` (e.g., "week-12")

**Document Structure**:
```typescript
{
  timestamp: Date;                      // Processing timestamp
  weekName: number;                     // Week number
  version: string;                      // Application version (e.g., "2.6.0")
  totalPlayersProcessed: number;        // Total players processed (currently 0)
  regionsProcessed: string[];           // Array of processed regions
  levelsProcessed: string[];            // Array of processed levels
}
```

**Use Cases**:
- Data validation
- Cache invalidation
- System monitoring
- Determining current week and data freshness

## Firebase Firestore Integration Strategy

### Firestore Web SDK Setup

#### Initial Firebase Configuration
**Objective**: Initialize Firebase app with Firestore in the Nuxt application

**Required Setup**:
- Install Firebase Web SDK in the client-side application
- Configure Firebase project credentials using environment variables
- Initialize Firestore instance with proper security rules
- Enable offline persistence for better user experience

**Authentication Considerations**:
- Firestore security rules allow public read access to championship data
- No user authentication required for viewing rankings
- All write operations handled server-side via Admin SDK

### Direct Firestore Queries

#### 1. Application Initialization
**Objective**: Get current week and validate data availability

**Firestore Query**:
- Query `computation-metadata` collection
- Get latest document or current week document
- Extract current week number and last update timestamp
- Use this data to determine which week's rankings to display

**Query Pattern**:
- Collection: `computation-metadata`
- Document ID: `week-{currentWeek}` (e.g., "week-12")
- Fields needed: `weekName`, `timestamp`, `version`, `totalPlayersProcessed`, `regionsProcessed`, `levelsProcessed`

**Example Query**:
```typescript
// Option 1: Get specific week (most efficient)
const metadataRef = firestore.collection('computation-metadata').doc(`week-${weekName}`);
const metadataDoc = await metadataRef.get();

if (metadataDoc.exists) {
  const metadata = metadataDoc.data();
  const currentWeek = metadata.weekName;
  const lastUpdated = metadata.timestamp.toDate();
  const version = metadata.version;
}

// Option 2: Query for latest week (requires index on timestamp)
const metadataSnapshot = await firestore.collection('computation-metadata')
  .orderBy('timestamp', 'desc')
  .limit(1)
  .get();

if (!metadataSnapshot.empty) {
  const latestMetadata = metadataSnapshot.docs[0].data();
  const currentWeek = latestMetadata.weekName;
  const lastUpdated = latestMetadata.timestamp.toDate();
}
```

#### 2. Region Summary Loading
**Objective**: Load region overview with AI insights and statistics

**Firestore Query**:
- Direct document fetch from `region-summaries` collection
- Document ID follows pattern: `{region}-week-{weekName}`
- Single read operation for complete region data

**Query Pattern**:
- Collection: `region-summaries`
- Document ID: `LIEGE-week-12` (example)
- Fields returned: `region`, `totalPlayers`, `playersByLevel`, `topPlayersByLevel`, `clubs`, `lastUpdated`, `aiSummary` (optional)

**Example Query**:
```typescript
const docRef = firestore.collection('region-summaries').doc(`${region}-week-${weekName}`);
const doc = await docRef.get();
if (doc.exists) {
  const data = doc.data();
  // data.region, data.totalPlayers, data.playersByLevel, etc.
}
```

**Real-time Option**:
- Use Firestore document snapshots for live updates:
```typescript
const unsubscribe = docRef.onSnapshot((doc) => {
  if (doc.exists) {
    const data = doc.data();
    // Update UI reactively
  }
});
// Cleanup: unsubscribe() when component unmounts
```
- Listen to document changes if data updates during user session
- Implement proper cleanup of listeners on component unmount

#### 3. Player Rankings Display
**Objective**: Query and display filtered player rankings

**Firestore Query Structure**:
- Collection: `rankings`
- Where clauses: region, level, weekName
- Order by: position (ascending)
- Limit: 50 players per page for performance

**Query Filtering**:
- Filter by region: `where('region', '==', selectedRegion)`
- Filter by level: `where('level', '==', selectedLevel)`
- Filter by week: `where('weekName', '==', currentWeek)`
- Sort by position: `orderBy('position', 'asc')`

**Example Query**:
```typescript
const rankingsRef = firestore.collection('rankings');
const query = rankingsRef
  .where('region', '==', 'LIEGE')
  .where('level', '==', 'Provincial 1')
  .where('weekName', '==', 12)
  .orderBy('position', 'asc')
  .limit(50);
const snapshot = await query.get();
```

**Pagination Implementation**:
- Use Firestore `limit()` and `startAfter()` for pagination
- Track last visible document for next page queries
- Implement infinite scroll or traditional page navigation

**Example Pagination**:
```typescript
// First page
let query = rankingsRef
  .where('region', '==', 'LIEGE')
  .where('level', '==', 'Provincial 1')
  .where('weekName', '==', 12)
  .orderBy('position', 'asc')
  .limit(50);

const firstPage = await query.get();
let lastDoc = firstPage.docs[firstPage.docs.length - 1];

// Next page
if (lastDoc) {
  const nextPage = await rankingsRef
    .where('region', '==', 'LIEGE')
    .where('level', '==', 'Provincial 1')
    .where('weekName', '==', 12)
    .orderBy('position', 'asc')
    .startAfter(lastDoc)
    .limit(50)
    .get();
}
```

#### 4. Player Detail Loading
**Objective**: Fetch comprehensive player statistics

**Firestore Query**:
- Direct document read from `players-points-details`
- Document ID is the player's uniqueIndex
- Single query returns complete player history

**Query Pattern**:
- Collection: `players-points-details`
- Document ID: player's uniqueIndex (e.g., "123456")
- Fields: `name`, `club`, `points` (array), `history` (array), `levelAttributed`, `lastUpdated`, `weekName`

**Example Query**:
```typescript
const playerRef = firestore.collection('players-points-details').doc(uniqueIndex);
const playerDoc = await playerRef.get();
if (playerDoc.exists) {
  const playerData = playerDoc.data();
  // playerData.name, playerData.club, playerData.points[], playerData.history[]
}
```

**Data Processing**:
- Sort `points` array by `weekName` descending for chronological display
- Sort `history` array by `weekName` descending for trend analysis
- Parse match history for performance trends
- Calculate statistics from raw match data

## Query Optimization

### Firestore Index Requirements

The application requires specific composite indexes for efficient querying:

1. **Region + Level + Week Queries** (Required)
   - Fields: `region` (asc), `level` (asc), `weekName` (desc), `position` (asc)
   - Used for: Main rankings display
   - Collection: `rankings`
   - **Note**: Firestore will prompt you to create this index on first query. Use the provided link.

2. **Region + Week Queries** (Optional)
   - Fields: `region` (asc), `weekName` (desc)
   - Used for: Region-specific queries across all levels
   - Collection: `rankings`

3. **Player History Queries** (Optional)
   - Fields: `uniqueIndex` (asc), `weekName` (desc)
   - Used for: Player performance tracking
   - Collection: `players-points-details` (uses document ID for direct access)

4. **Club-based Queries** (Optional)
   - Fields: `clubIndex` (asc), `weekName` (desc), `points.total` (desc)
   - Used for: Club performance analysis
   - Collection: `rankings`

**Important**: The composite index for `region + level + weekName + position` is essential for the main rankings queries. Firestore will automatically detect when this index is needed and provide a link to create it.

### Firestore Caching and Offline Support

#### Firestore Offline Persistence
- Enable Firestore offline persistence for automatic local caching
- Cached data available immediately on app load
- Automatic synchronization when connection restored

#### Custom Caching Strategy
- Use Firestore's built-in caching mechanisms
- Implement memory caching for frequently accessed region summaries
- Cache player rankings data during user session
- Store user preferences (selected region/level) in localStorage

#### Cache Invalidation
- Rely on Firestore's automatic cache management
- Implement manual cache refresh for stale data detection
- Use timestamp comparison for data freshness validation

## Performance Considerations

### Data Loading Patterns

#### Progressive Loading
1. Load region overview first (fastest)
2. Load basic player list for selected level
3. Load detailed player data on demand (modal/detail view)

#### Pagination Strategy
- Load 50 players initially
- Implement infinite scroll or traditional pagination
- Preload next page on user scroll

#### Firestore Real-time Capabilities
- Championship data updates weekly, real-time not critical
- Use Firestore snapshots for live data if needed during computation
- Focus on fast initial loads and smooth offline experience

### Firestore Error Handling

#### Network Failures
- Firestore Web SDK handles offline scenarios automatically
- Implement custom error handling for query failures
- Show user-friendly messages for network issues
- Use cached data when offline

#### Missing Data Scenarios
- Handle documents that don't exist gracefully
- Check for AI summary availability before displaying
- Provide fallback UI when player details are missing
- Implement proper loading states during queries

#### Query Limitations
- Handle Firestore query limits (composite index requirements)
- Implement fallback queries if complex filters fail
- Manage quota exceeded scenarios

## Firestore Integration Architecture

### Firebase Project Configuration

#### Environment Setup
- Configure Firebase project credentials for web app
- Set up Firestore database with proper security rules
- Enable offline persistence in Firebase configuration
- Configure authentication (if needed for admin features)

#### Security Rules Considerations
- Public read access for championship data collections
- Restrict write access to server-side operations only
- Implement field-level security where appropriate
- Rate limiting through Firebase console

### Client-Side Firestore Usage

#### Query Construction Patterns
- Build dynamic queries based on user selections
- Use query constraints for filtering and ordering
- Implement proper error boundaries around queries
- Handle loading states during query execution

#### Data Transformation
- Transform Firestore documents to application data models
- Parse nested objects (AI summaries, points breakdowns)
- Sort and filter data on client-side when needed
- Implement data validation for UI consistency

**Common Transformations**:
```typescript
// Transform ranking document
const transformRanking = (doc: DocumentSnapshot) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    points: {
      ...data.points,
      breakdown: data.points.breakdown // Already structured
    }
  };
};

// Transform player points details
const transformPlayerDetails = (doc: DocumentSnapshot) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    points: data.points.sort((a, b) => b.weekName - a.weekName), // Sort descending
    history: data.history.sort((a, b) => b.weekName - a.weekName)
  };
};

// Transform region summary
const transformRegionSummary = (doc: DocumentSnapshot) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    aiSummary: data.aiSummary || null, // Handle optional AI summary
    lastUpdated: data.lastUpdated.toDate() // Convert Firestore timestamp
  };
};
```

#### Memory Management
- Properly detach Firestore listeners on component cleanup
- Manage query subscriptions to prevent memory leaks
- Use Firestore's built-in garbage collection
- Implement lazy loading for large datasets

## State Management

### Application State Structure

#### Global State
- Current selected region
- Current week number
- Available regions list
- User preferences (cached selections)

#### Page-Level State
- Region summary data
- Current level selection
- Player rankings list
- Loading and error states

#### Component State
- Selected player for detail view
- Modal visibility
- Sorting preferences
- Search filters

### Firestore-Specific State Management

#### Query State Management
- Track active Firestore queries and subscriptions
- Manage loading states for each collection query
- Handle query errors and retry mechanisms
- Maintain query results in reactive state

#### Real-time Data Synchronization
- Use Firestore document listeners where appropriate
- Update UI reactively when data changes
- Handle listener attachment and detachment
- Manage subscription lifecycle with component lifecycle

#### Browser Navigation Integration
- Store query parameters (region, level, week) in URL
- Enable deep linking to specific rankings views
- Use browser history for navigation state
- Restore Firestore queries from URL parameters

## Firestore Performance Optimization

### Query Optimization Strategies
- Use composite indexes for complex multi-field queries
- Limit query results to necessary data only
- Implement query result caching at application level
- Use Firestore's built-in caching for repeated queries

### Data Loading Best Practices
- Load region summary first (single document read)
- Defer player rankings until level selected
- Lazy load player details on user interaction
- Implement progressive data loading for better UX

### Mobile and Offline Considerations
- Enable Firestore offline persistence for mobile users
- Prioritize essential data for offline availability
- Handle network state changes gracefully
- Provide clear indicators of offline vs online data

### Cost Optimization
- Minimize document reads through efficient queries
- Use Firestore's local cache to reduce billable operations
- Implement proper pagination to limit data transfer
- Monitor query performance and optimize expensive operations

This Firestore-based architecture provides direct client-side data access while leveraging Firebase's offline capabilities, real-time features, and automatic scaling, making it ideal for a responsive championship rankings application with AI-powered insights.
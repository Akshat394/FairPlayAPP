export interface User {
  id: string
  username: string
  email: string
  role: 'athlete' | 'coach' | 'doctor' | 'admin'
  avatar: AvatarConfig
  stats: UserStats
  achievements: Achievement[]
  createdAt: Date
  lastActive: Date
}

export interface AvatarConfig {
  id: string
  name: string
  height: number // 1.5 - 2.2 meters
  weight: number // 40 - 150 kg
  bodyType: 'slim' | 'athletic' | 'muscular' | 'heavy'
  sport: SportType
  gear: GearItem[]
  customization: {
    skinTone: string
    hairColor: string
    hairStyle: string
    eyeColor: string
    facialFeatures: FacialFeatures
  }
  animations: {
    idle: string
    walk: string
    run: string
    sport: string[]
  }
}

export interface FacialFeatures {
  eyeSize: number
  noseSize: number
  mouthSize: number
  jawWidth: number
  cheekbones: number
}

export type SportType = 
  | 'sprinting' 
  | 'swimming' 
  | 'weightlifting' 
  | 'cycling' 
  | 'gymnastics' 
  | 'football' 
  | 'basketball' 
  | 'tennis'
  | 'general'

export interface GearItem {
  id: string
  name: string
  type: 'clothing' | 'equipment' | 'accessory'
  sport: SportType[]
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlocked: boolean
  equipped: boolean
  stats?: {
    performance?: number
    style?: number
    authenticity?: number
  }
}

export interface UserStats {
  level: number
  xp: number
  xpToNext: number
  totalQuizzes: number
  correctAnswers: number
  forumPosts: number
  forumUpvotes: number
  minigamesPlayed: number
  minigameHighScores: Record<string, number>
  timeSpent: number // minutes
  streakDays: number
  lastLogin: Date
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum'
  unlockedAt: Date
  progress?: {
    current: number
    required: number
  }
}

export interface GameState {
  isConnected: boolean
  currentScene: SceneType
  playerPosition: Vector3
  nearbyPlayers: Player[]
  activeInteractions: Interaction[]
  ui: UIState
}

export type SceneType = 
  | 'plaza' 
  | 'gym' 
  | 'medical-hub' 
  | 'coach-colosseum' 
  | 'game-hall'
  | 'forum-space'

export interface Vector3 {
  x: number
  y: number
  z: number
}

export interface Player {
  id: string
  username: string
  position: Vector3
  rotation: Vector3
  avatar: AvatarConfig
  isMoving: boolean
  currentAnimation: string
  isNearby: boolean
  distance: number
}

export interface Interaction {
  id: string
  type: InteractionType
  target: string
  position: Vector3
  range: number
  isActive: boolean
  data?: any
}

export type InteractionType = 
  | 'building-enter'
  | 'equipment-use'
  | 'player-chat'
  | 'quiz-start'
  | 'minigame-start'
  | 'forum-access'
  | 'consultation-request'

export interface UIState {
  activePanel: PanelType | null
  chatVisible: boolean
  minimapVisible: boolean
  inventoryVisible: boolean
  settingsVisible: boolean
  notifications: Notification[]
}

export type PanelType = 
  | 'avatar-customizer'
  | 'quiz-interface'
  | 'forum-browser'
  | 'leaderboard'
  | 'achievements'
  | 'settings'
  | 'consultation'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
  style?: 'primary' | 'secondary' | 'danger'
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'scenario'
  options?: string[]
  correctAnswer: string | number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: QuizCategory
  points: number
  timeLimit?: number
  multimedia?: {
    image?: string
    video?: string
    audio?: string
  }
}

export type QuizCategory = 
  | 'wada-code'
  | 'prohibited-substances'
  | 'testing-procedures'
  | 'therapeutic-use'
  | 'athlete-rights'
  | 'consequences'
  | 'prevention'

export interface ForumPost {
  id: string
  title: string
  content: string
  author: User
  category: ForumCategory
  tags: string[]
  upvotes: number
  downvotes: number
  replies: ForumReply[]
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
  isLocked: boolean
  expertVerified: boolean
}

export type ForumCategory = 
  | 'general-discussion'
  | 'doping-regulations'
  | 'nutrition-supplements'
  | 'testing-experiences'
  | 'athlete-support'
  | 'coach-corner'
  | 'medical-advice'
  | 'case-studies'

export interface ForumReply {
  id: string
  content: string
  author: User
  upvotes: number
  downvotes: number
  createdAt: Date
  parentReply?: string
  expertVerified: boolean
}

export interface Minigame {
  id: string
  name: string
  description: string
  type: MinigameType
  difficulty: 'easy' | 'medium' | 'hard'
  maxScore: number
  timeLimit: number
  rewards: {
    xp: number
    achievements?: string[]
    gear?: string[]
  }
}

export type MinigameType = 
  | 'doping-detective'
  | 'clean-sprint'
  | 'wada-puzzle'
  | 'substance-match'
  | 'regulation-quiz'
  | 'ethics-scenario'

export interface Building {
  id: string
  name: string
  type: SceneType
  position: Vector3
  rotation: Vector3
  scale: Vector3
  interactionZone: {
    position: Vector3
    radius: number
  }
  isAccessible: boolean
  requiredLevel?: number
  description: string
}

export interface Equipment {
  id: string
  name: string
  type: EquipmentType
  position: Vector3
  rotation: Vector3
  isOccupied: boolean
  occupiedBy?: string
  interactionRange: number
  animations: string[]
  effects: EquipmentEffect[]
}

export type EquipmentType = 
  | 'treadmill'
  | 'weights'
  | 'rowing-machine'
  | 'bike'
  | 'pull-up-bar'
  | 'bench-press'
  | 'squat-rack'

export interface EquipmentEffect {
  type: 'fatigue' | 'strength' | 'endurance' | 'form'
  value: number
  duration: number
}

export interface ChatMessage {
  id: string
  sender: User
  content: string
  type: 'text' | 'voice' | 'system'
  timestamp: Date
  channel: ChatChannel
  isPrivate: boolean
  recipients?: string[]
}

export type ChatChannel = 
  | 'global'
  | 'proximity'
  | 'building'
  | 'private'
  | 'expert'

export interface ConsultationSession {
  id: string
  patient: User
  doctor: User
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  scheduledAt: Date
  duration: number
  topic: string
  notes?: string
  prescription?: string
  followUp?: Date
  isEmergency: boolean
}

export interface GameSettings {
  graphics: {
    quality: 'low' | 'medium' | 'high' | 'ultra'
    shadows: boolean
    antialiasing: boolean
    postProcessing: boolean
    particleEffects: boolean
  }
  audio: {
    master: number
    music: number
    sfx: number
    voice: number
    spatialAudio: boolean
  }
  controls: {
    mouseSensitivity: number
    invertY: boolean
    keyBindings: Record<string, string>
    gamepadEnabled: boolean
  }
  accessibility: {
    colorBlindMode: boolean
    highContrast: boolean
    textToSpeech: boolean
    voiceNavigation: boolean
    subtitles: boolean
  }
  privacy: {
    showOnlineStatus: boolean
    allowDirectMessages: boolean
    shareProgress: boolean
    dataCollection: boolean
  }
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: Date
}

export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: Date
  sender?: string
}

export interface PerformanceMetrics {
  fps: number
  memory: number
  drawCalls: number
  triangles: number
  latency: number
  packetLoss: number
}
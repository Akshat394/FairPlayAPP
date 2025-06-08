import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PanelType, Notification } from '@types/index'

interface UIState {
  activePanel: PanelType | null
  chatVisible: boolean
  minimapVisible: boolean
  inventoryVisible: boolean
  settingsVisible: boolean
  achievementsVisible: boolean
  leaderboardVisible: boolean
  notifications: Notification[]
  isFullscreen: boolean
  isMobile: boolean
  screenSize: { width: number; height: number }
  theme: 'light' | 'dark'
  language: string
}

const initialState: UIState = {
  activePanel: null,
  chatVisible: false,
  minimapVisible: true,
  inventoryVisible: false,
  settingsVisible: false,
  achievementsVisible: false,
  leaderboardVisible: false,
  notifications: [],
  isFullscreen: false,
  isMobile: false,
  screenSize: { width: window.innerWidth, height: window.innerHeight },
  theme: 'dark',
  language: 'en'
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActivePanel: (state, action: PayloadAction<PanelType | null>) => {
      state.activePanel = action.payload
    },
    
    togglePanel: (state, action: PayloadAction<PanelType>) => {
      state.activePanel = state.activePanel === action.payload ? null : action.payload
    },
    
    closeAllPanels: (state) => {
      state.activePanel = null
      state.chatVisible = false
      state.inventoryVisible = false
      state.settingsVisible = false
      state.achievementsVisible = false
      state.leaderboardVisible = false
    },
    
    toggleChat: (state) => {
      state.chatVisible = !state.chatVisible
    },
    
    toggleMinimap: (state) => {
      state.minimapVisible = !state.minimapVisible
    },
    
    toggleInventory: (state) => {
      state.inventoryVisible = !state.inventoryVisible
    },
    
    toggleSettings: (state) => {
      state.settingsVisible = !state.settingsVisible
    },
    
    toggleAchievements: (state) => {
      state.achievementsVisible = !state.achievementsVisible
    },
    
    toggleLeaderboard: (state) => {
      state.leaderboardVisible = !state.leaderboardVisible
    },
    
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false
      }
      state.notifications.unshift(notification)
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(n => n.read = true)
    },
    
    clearNotifications: (state) => {
      state.notifications = []
    },
    
    setFullscreen: (state, action: PayloadAction<boolean>) => {
      state.isFullscreen = action.payload
    },
    
    setMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload
    },
    
    updateScreenSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.screenSize = action.payload
      state.isMobile = action.payload.width < 768
    },
    
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    }
  }
})

export const {
  setActivePanel,
  togglePanel,
  closeAllPanels,
  toggleChat,
  toggleMinimap,
  toggleInventory,
  toggleSettings,
  toggleAchievements,
  toggleLeaderboard,
  addNotification,
  removeNotification,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
  setFullscreen,
  setMobile,
  updateScreenSize,
  setTheme,
  setLanguage
} = uiSlice.actions

export default uiSlice.reducer
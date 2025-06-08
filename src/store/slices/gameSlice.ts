import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GameState, Player, Building, Equipment, SceneType, Vector3, Interaction } from '@types/index'

const initialState: GameState = {
  isConnected: false,
  currentScene: 'plaza',
  playerPosition: { x: 0, y: 0, z: 0 },
  nearbyPlayers: [],
  activeInteractions: [],
  ui: {
    activePanel: null,
    chatVisible: false,
    minimapVisible: true,
    inventoryVisible: false,
    settingsVisible: false,
    notifications: []
  }
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },
    
    setCurrentScene: (state, action: PayloadAction<SceneType>) => {
      state.currentScene = action.payload
    },
    
    updatePlayerPosition: (state, action: PayloadAction<Vector3>) => {
      state.playerPosition = action.payload
    },
    
    updateNearbyPlayers: (state, action: PayloadAction<Player[]>) => {
      state.nearbyPlayers = action.payload
    },
    
    addPlayer: (state, action: PayloadAction<Player>) => {
      const existingIndex = state.nearbyPlayers.findIndex(p => p.id === action.payload.id)
      if (existingIndex >= 0) {
        state.nearbyPlayers[existingIndex] = action.payload
      } else {
        state.nearbyPlayers.push(action.payload)
      }
    },
    
    removePlayer: (state, action: PayloadAction<string>) => {
      state.nearbyPlayers = state.nearbyPlayers.filter(p => p.id !== action.payload)
    },
    
    updatePlayerData: (state, action: PayloadAction<{ id: string; data: Partial<Player> }>) => {
      const player = state.nearbyPlayers.find(p => p.id === action.payload.id)
      if (player) {
        Object.assign(player, action.payload.data)
      }
    },
    
    addInteraction: (state, action: PayloadAction<Interaction>) => {
      state.activeInteractions.push(action.payload)
    },
    
    removeInteraction: (state, action: PayloadAction<string>) => {
      state.activeInteractions = state.activeInteractions.filter(i => i.id !== action.payload)
    },
    
    updateInteraction: (state, action: PayloadAction<{ id: string; data: Partial<Interaction> }>) => {
      const interaction = state.activeInteractions.find(i => i.id === action.payload.id)
      if (interaction) {
        Object.assign(interaction, action.payload.data)
      }
    },
    
    // UI Actions
    setActivePanel: (state, action: PayloadAction<string | null>) => {
      state.ui.activePanel = action.payload as any
    },
    
    toggleChat: (state) => {
      state.ui.chatVisible = !state.ui.chatVisible
    },
    
    toggleMinimap: (state) => {
      state.ui.minimapVisible = !state.ui.minimapVisible
    },
    
    toggleInventory: (state) => {
      state.ui.inventoryVisible = !state.ui.inventoryVisible
    },
    
    toggleSettings: (state) => {
      state.ui.settingsVisible = !state.ui.settingsVisible
    },
    
    addNotification: (state, action: PayloadAction<any>) => {
      state.ui.notifications.push(action.payload)
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.ui.notifications = state.ui.notifications.filter(n => n.id !== action.payload)
    },
    
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.ui.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    }
  }
})

export const {
  setConnectionStatus,
  setCurrentScene,
  updatePlayerPosition,
  updateNearbyPlayers,
  addPlayer,
  removePlayer,
  updatePlayerData,
  addInteraction,
  removeInteraction,
  updateInteraction,
  setActivePanel,
  toggleChat,
  toggleMinimap,
  toggleInventory,
  toggleSettings,
  addNotification,
  removeNotification,
  markNotificationRead
} = gameSlice.actions

export default gameSlice.reducer
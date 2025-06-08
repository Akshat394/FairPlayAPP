import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { GameSettings, PerformanceMetrics } from '@types/index'

interface AppState {
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  settings: GameSettings
  performance: PerformanceMetrics
  version: string
  lastUpdate: Date | null
}

const initialSettings: GameSettings = {
  graphics: {
    quality: 'medium',
    shadows: true,
    antialiasing: true,
    postProcessing: true,
    particleEffects: true
  },
  audio: {
    master: 0.8,
    music: 0.6,
    sfx: 0.8,
    voice: 0.9,
    spatialAudio: true
  },
  controls: {
    mouseSensitivity: 0.5,
    invertY: false,
    keyBindings: {
      forward: 'KeyW',
      backward: 'KeyS',
      left: 'KeyA',
      right: 'KeyD',
      jump: 'Space',
      interact: 'KeyE',
      chat: 'KeyT',
      inventory: 'KeyI',
      map: 'KeyM'
    },
    gamepadEnabled: false
  },
  accessibility: {
    colorBlindMode: false,
    highContrast: false,
    textToSpeech: false,
    voiceNavigation: false,
    subtitles: true
  },
  privacy: {
    showOnlineStatus: true,
    allowDirectMessages: true,
    shareProgress: true,
    dataCollection: true
  }
}

const initialPerformance: PerformanceMetrics = {
  fps: 60,
  memory: 0,
  drawCalls: 0,
  triangles: 0,
  latency: 0,
  packetLoss: 0
}

const initialState: AppState = {
  isInitialized: false,
  isLoading: false,
  error: null,
  settings: initialSettings,
  performance: initialPerformance,
  version: '1.0.0',
  lastUpdate: null
}

export const initializeApp = createAsyncThunk(
  'app/initialize',
  async (_, { rejectWithValue }) => {
    try {
      // Load saved settings from localStorage
      const savedSettings = localStorage.getItem('fairplay-settings')
      const settings = savedSettings ? JSON.parse(savedSettings) : initialSettings

      // Initialize performance monitoring
      const performance = { ...initialPerformance }

      // Check for updates
      const lastUpdate = new Date()

      return {
        settings,
        performance,
        lastUpdate
      }
    } catch (error) {
      return rejectWithValue('Failed to initialize application')
    }
  }
)

export const updateSettings = createAsyncThunk(
  'app/updateSettings',
  async (newSettings: Partial<GameSettings>, { getState }) => {
    const state = getState() as { app: AppState }
    const updatedSettings = { ...state.app.settings, ...newSettings }
    
    // Save to localStorage
    localStorage.setItem('fairplay-settings', JSON.stringify(updatedSettings))
    
    return updatedSettings
  }
)

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    updatePerformance: (state, action: PayloadAction<Partial<PerformanceMetrics>>) => {
      state.performance = { ...state.performance, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeApp.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoading = false
        state.isInitialized = true
        state.settings = action.payload.settings
        state.performance = action.payload.performance
        state.lastUpdate = action.payload.lastUpdate
      })
      .addCase(initializeApp.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = action.payload
      })
  }
})

export const { setError, updatePerformance, clearError } = appSlice.actions
export default appSlice.reducer
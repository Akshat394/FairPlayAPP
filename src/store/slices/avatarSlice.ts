import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { AvatarConfig, GearItem, SportType } from '@types/index'
import { avatarAPI } from '@services/api'

interface AvatarState {
  config: AvatarConfig | null
  availableGear: GearItem[]
  isCustomizing: boolean
  isLoading: boolean
  error: string | null
}

const defaultAvatar: AvatarConfig = {
  id: '',
  name: 'Default Avatar',
  height: 1.75,
  weight: 70,
  bodyType: 'athletic',
  sport: 'general',
  gear: [],
  customization: {
    skinTone: '#F4C2A1',
    hairColor: '#8B4513',
    hairStyle: 'short',
    eyeColor: '#4A90E2',
    facialFeatures: {
      eyeSize: 0.5,
      noseSize: 0.5,
      mouthSize: 0.5,
      jawWidth: 0.5,
      cheekbones: 0.5
    }
  },
  animations: {
    idle: 'idle',
    walk: 'walk',
    run: 'run',
    sport: ['sport_idle']
  }
}

const initialState: AvatarState = {
  config: defaultAvatar,
  availableGear: [],
  isCustomizing: false,
  isLoading: false,
  error: null
}

export const loadAvatar = createAsyncThunk(
  'avatar/load',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await avatarAPI.getAvatar(userId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load avatar')
    }
  }
)

export const saveAvatar = createAsyncThunk(
  'avatar/save',
  async (config: AvatarConfig, { rejectWithValue }) => {
    try {
      const response = await avatarAPI.saveAvatar(config)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save avatar')
    }
  }
)

export const loadGear = createAsyncThunk(
  'avatar/loadGear',
  async (_, { rejectWithValue }) => {
    try {
      const response = await avatarAPI.getAvailableGear()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load gear')
    }
  }
)

const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    startCustomization: (state) => {
      state.isCustomizing = true
    },
    
    stopCustomization: (state) => {
      state.isCustomizing = false
    },
    
    updateHeight: (state, action: PayloadAction<number>) => {
      if (state.config) {
        state.config.height = Math.max(1.5, Math.min(2.2, action.payload))
      }
    },
    
    updateWeight: (state, action: PayloadAction<number>) => {
      if (state.config) {
        state.config.weight = Math.max(40, Math.min(150, action.payload))
      }
    },
    
    updateBodyType: (state, action: PayloadAction<'slim' | 'athletic' | 'muscular' | 'heavy'>) => {
      if (state.config) {
        state.config.bodyType = action.payload
      }
    },
    
    updateSport: (state, action: PayloadAction<SportType>) => {
      if (state.config) {
        state.config.sport = action.payload
        // Update available animations based on sport
        state.config.animations.sport = [`${action.payload}_idle`, `${action.payload}_action`]
      }
    },
    
    updateCustomization: (state, action: PayloadAction<Partial<AvatarConfig['customization']>>) => {
      if (state.config) {
        state.config.customization = { ...state.config.customization, ...action.payload }
      }
    },
    
    updateFacialFeatures: (state, action: PayloadAction<Partial<AvatarConfig['customization']['facialFeatures']>>) => {
      if (state.config) {
        state.config.customization.facialFeatures = {
          ...state.config.customization.facialFeatures,
          ...action.payload
        }
      }
    },
    
    equipGear: (state, action: PayloadAction<string>) => {
      if (state.config) {
        const gear = state.availableGear.find(g => g.id === action.payload)
        if (gear && gear.unlocked) {
          // Unequip any gear of the same type
          state.config.gear = state.config.gear.filter(g => g.type !== gear.type)
          // Equip new gear
          state.config.gear.push({ ...gear, equipped: true })
        }
      }
    },
    
    unequipGear: (state, action: PayloadAction<string>) => {
      if (state.config) {
        state.config.gear = state.config.gear.filter(g => g.id !== action.payload)
      }
    },
    
    unlockGear: (state, action: PayloadAction<string>) => {
      const gear = state.availableGear.find(g => g.id === action.payload)
      if (gear) {
        gear.unlocked = true
      }
    },
    
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAvatar.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadAvatar.fulfilled, (state, action) => {
        state.isLoading = false
        state.config = action.payload
      })
      .addCase(loadAvatar.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      .addCase(saveAvatar.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(saveAvatar.fulfilled, (state, action) => {
        state.isLoading = false
        state.config = action.payload
      })
      .addCase(saveAvatar.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      .addCase(loadGear.fulfilled, (state, action) => {
        state.availableGear = action.payload
      })
  }
})

export const {
  startCustomization,
  stopCustomization,
  updateHeight,
  updateWeight,
  updateBodyType,
  updateSport,
  updateCustomization,
  updateFacialFeatures,
  equipGear,
  unequipGear,
  unlockGear,
  clearError
} = avatarSlice.actions

export default avatarSlice.reducer
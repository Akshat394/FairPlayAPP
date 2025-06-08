import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Achievement, UserStats } from '@types/index'
import { achievementAPI } from '@services/api'

interface AchievementState {
  achievements: Achievement[]
  unlockedAchievements: Achievement[]
  recentUnlocks: Achievement[]
  stats: UserStats | null
  isLoading: boolean
  error: string | null
}

const initialState: AchievementState = {
  achievements: [],
  unlockedAchievements: [],
  recentUnlocks: [],
  stats: null,
  isLoading: false,
  error: null
}

export const loadAchievements = createAsyncThunk(
  'achievements/load',
  async (_, { rejectWithValue }) => {
    try {
      const response = await achievementAPI.getAchievements()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load achievements')
    }
  }
)

export const loadUserStats = createAsyncThunk(
  'achievements/loadStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await achievementAPI.getUserStats()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load user stats')
    }
  }
)

export const checkAchievements = createAsyncThunk(
  'achievements/check',
  async (action: {
    type: 'quiz_completed' | 'forum_post' | 'forum_upvote' | 'minigame_played' | 'login_streak'
    data?: any
  }, { rejectWithValue }) => {
    try {
      const response = await achievementAPI.checkAchievements(action)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to check achievements')
    }
  }
)

const achievementSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    unlockAchievement: (state, action: PayloadAction<Achievement>) => {
      const achievement = action.payload
      
      // Add to unlocked achievements if not already there
      if (!state.unlockedAchievements.find(a => a.id === achievement.id)) {
        state.unlockedAchievements.push(achievement)
        state.recentUnlocks.unshift(achievement)
        
        // Keep only last 10 recent unlocks
        if (state.recentUnlocks.length > 10) {
          state.recentUnlocks = state.recentUnlocks.slice(0, 10)
        }
      }
      
      // Update in main achievements list
      const mainAchievement = state.achievements.find(a => a.id === achievement.id)
      if (mainAchievement) {
        mainAchievement.unlockedAt = achievement.unlockedAt
      }
    },
    
    updateAchievementProgress: (state, action: PayloadAction<{
      id: string
      progress: { current: number; required: number }
    }>) => {
      const achievement = state.achievements.find(a => a.id === action.payload.id)
      if (achievement) {
        achievement.progress = action.payload.progress
      }
    },
    
    updateStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload }
      }
    },
    
    incrementStat: (state, action: PayloadAction<{
      stat: keyof UserStats
      amount: number
    }>) => {
      if (state.stats) {
        const currentValue = state.stats[action.payload.stat] as number
        ;(state.stats as any)[action.payload.stat] = currentValue + action.payload.amount
      }
    },
    
    clearRecentUnlocks: (state) => {
      state.recentUnlocks = []
    },
    
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAchievements.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadAchievements.fulfilled, (state, action) => {
        state.isLoading = false
        state.achievements = action.payload.all
        state.unlockedAchievements = action.payload.unlocked
      })
      .addCase(loadAchievements.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      .addCase(loadUserStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
      
      .addCase(checkAchievements.fulfilled, (state, action) => {
        // Handle newly unlocked achievements
        if (action.payload.newUnlocks) {
          action.payload.newUnlocks.forEach((achievement: Achievement) => {
            if (!state.unlockedAchievements.find(a => a.id === achievement.id)) {
              state.unlockedAchievements.push(achievement)
              state.recentUnlocks.unshift(achievement)
            }
          })
          
          // Keep only last 10 recent unlocks
          if (state.recentUnlocks.length > 10) {
            state.recentUnlocks = state.recentUnlocks.slice(0, 10)
          }
        }
        
        // Update progress for all achievements
        if (action.payload.progress) {
          action.payload.progress.forEach((update: any) => {
            const achievement = state.achievements.find(a => a.id === update.id)
            if (achievement) {
              achievement.progress = update.progress
            }
          })
        }
      })
  }
})

export const {
  unlockAchievement,
  updateAchievementProgress,
  updateStats,
  incrementStat,
  clearRecentUnlocks,
  clearError
} = achievementSlice.actions

export default achievementSlice.reducer
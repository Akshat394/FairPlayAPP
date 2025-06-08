import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { QuizQuestion, QuizCategory } from '@types/index'
import { quizAPI } from '@services/api'

interface QuizState {
  currentQuiz: QuizQuestion[]
  currentQuestion: number
  answers: Record<string, string | number>
  score: number
  totalQuestions: number
  timeRemaining: number
  isActive: boolean
  isLoading: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  category: QuizCategory | 'all'
  results: QuizResult | null
  history: QuizResult[]
  streakCount: number
  bestScore: number
}

interface QuizResult {
  id: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  difficulty: 'easy' | 'medium' | 'hard'
  category: QuizCategory | 'all'
  completedAt: Date
  answers: Record<string, { answer: string | number; correct: boolean; timeSpent: number }>
}

const initialState: QuizState = {
  currentQuiz: [],
  currentQuestion: 0,
  answers: {},
  score: 0,
  totalQuestions: 0,
  timeRemaining: 0,
  isActive: false,
  isLoading: false,
  difficulty: 'medium',
  category: 'all',
  results: null,
  history: [],
  streakCount: 0,
  bestScore: 0
}

export const generateQuiz = createAsyncThunk(
  'quiz/generate',
  async (params: {
    difficulty: 'easy' | 'medium' | 'hard'
    category: QuizCategory | 'all'
    questionCount: number
  }, { rejectWithValue }) => {
    try {
      const response = await quizAPI.generateQuiz(params)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to generate quiz')
    }
  }
)

export const submitQuiz = createAsyncThunk(
  'quiz/submit',
  async (answers: Record<string, string | number>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { quiz: QuizState }
      const response = await quizAPI.submitQuiz({
        quizId: 'current',
        answers,
        timeSpent: 0, // Calculate based on start time
        difficulty: state.quiz.difficulty,
        category: state.quiz.category
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit quiz')
    }
  }
)

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz: (state, action: PayloadAction<{
      questions: QuizQuestion[]
      difficulty: 'easy' | 'medium' | 'hard'
      category: QuizCategory | 'all'
    }>) => {
      state.currentQuiz = action.payload.questions
      state.totalQuestions = action.payload.questions.length
      state.difficulty = action.payload.difficulty
      state.category = action.payload.category
      state.currentQuestion = 0
      state.answers = {}
      state.score = 0
      state.isActive = true
      state.results = null
      
      // Set time limit based on difficulty
      const baseTime = 30 // seconds per question
      const timeMultiplier = {
        easy: 1.5,
        medium: 1.0,
        hard: 0.75
      }
      state.timeRemaining = baseTime * timeMultiplier[action.payload.difficulty] * action.payload.questions.length
    },
    
    answerQuestion: (state, action: PayloadAction<{ questionId: string; answer: string | number }>) => {
      state.answers[action.payload.questionId] = action.payload.answer
    },
    
    nextQuestion: (state) => {
      if (state.currentQuestion < state.totalQuestions - 1) {
        state.currentQuestion += 1
      }
    },
    
    previousQuestion: (state) => {
      if (state.currentQuestion > 0) {
        state.currentQuestion -= 1
      }
    },
    
    goToQuestion: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.totalQuestions) {
        state.currentQuestion = action.payload
      }
    },
    
    updateTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = Math.max(0, action.payload)
      if (state.timeRemaining === 0) {
        state.isActive = false
      }
    },
    
    pauseQuiz: (state) => {
      state.isActive = false
    },
    
    resumeQuiz: (state) => {
      state.isActive = true
    },
    
    endQuiz: (state) => {
      state.isActive = false
    },
    
    setDifficulty: (state, action: PayloadAction<'easy' | 'medium' | 'hard'>) => {
      state.difficulty = action.payload
    },
    
    setCategory: (state, action: PayloadAction<QuizCategory | 'all'>) => {
      state.category = action.payload
    },
    
    updateStreak: (state, action: PayloadAction<number>) => {
      state.streakCount = action.payload
    },
    
    updateBestScore: (state, action: PayloadAction<number>) => {
      if (action.payload > state.bestScore) {
        state.bestScore = action.payload
      }
    },
    
    addToHistory: (state, action: PayloadAction<QuizResult>) => {
      state.history.unshift(action.payload)
      
      // Keep only last 50 results
      if (state.history.length > 50) {
        state.history = state.history.slice(0, 50)
      }
    },
    
    clearHistory: (state) => {
      state.history = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQuiz.pending, (state) => {
        state.isLoading = true
      })
      .addCase(generateQuiz.fulfilled, (state, action) => {
        state.isLoading = false
        // Quiz will be started via startQuiz action
      })
      .addCase(generateQuiz.rejected, (state) => {
        state.isLoading = false
      })
      
      .addCase(submitQuiz.pending, (state) => {
        state.isLoading = true
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.isLoading = false
        state.results = action.payload
        state.score = action.payload.score
        
        // Update streak and best score
        if (action.payload.score > state.bestScore) {
          state.bestScore = action.payload.score
        }
        
        // Add to history
        state.history.unshift(action.payload)
        if (state.history.length > 50) {
          state.history = state.history.slice(0, 50)
        }
      })
      .addCase(submitQuiz.rejected, (state) => {
        state.isLoading = false
      })
  }
})

export const {
  startQuiz,
  answerQuestion,
  nextQuestion,
  previousQuestion,
  goToQuestion,
  updateTimeRemaining,
  pauseQuiz,
  resumeQuiz,
  endQuiz,
  setDifficulty,
  setCategory,
  updateStreak,
  updateBestScore,
  addToHistory,
  clearHistory
} = quizSlice.actions

export default quizSlice.reducer
import { configureStore } from '@reduxjs/toolkit'
import appSlice from './slices/appSlice'
import authSlice from './slices/authSlice'
import gameSlice from './slices/gameSlice'
import avatarSlice from './slices/avatarSlice'
import uiSlice from './slices/uiSlice'
import chatSlice from './slices/chatSlice'
import quizSlice from './slices/quizSlice'
import forumSlice from './slices/forumSlice'
import achievementSlice from './slices/achievementSlice'

export const store = configureStore({
  reducer: {
    app: appSlice,
    auth: authSlice,
    game: gameSlice,
    avatar: avatarSlice,
    ui: uiSlice,
    chat: chatSlice,
    quiz: quizSlice,
    forum: forumSlice,
    achievements: achievementSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['game.lastUpdate', 'chat.messages.timestamp']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
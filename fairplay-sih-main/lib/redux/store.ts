import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import learnReducer from '@/lib/redux/slice/learn'
import quizReducer from '@/lib/redux/slice/quiz'

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    learn: learnReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import robotReducer from './robotSlice'
// …import other slices

export const store = configureStore({
  reducer: {
    user: userReducer,
    robots: robotReducer,
    // …
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

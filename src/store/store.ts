import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { articlesSlice } from 'src/slices/postSlice.ts'
import { api, api } from 'src/services/RWBService.ts'

const rootReducer = combineReducers({
  articles: articlesSlice.reducer,
  [api.reducerPath]: api.reducer,
  [api.reducerPath]: api.reducer,
})

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([api.middleware, api.middleware]),
  devTools: true,
})

export type RootStateType = ReturnType<typeof store.getState>
export type StoreType = typeof store
export type AppDispatch = StoreType['dispatch']

export const useAppDispatch = useDispatch<AppDispatch>
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector

export default store

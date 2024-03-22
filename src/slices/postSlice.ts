import { createSlice, Slice } from '@reduxjs/toolkit'

import type { RootStateType } from 'src/store/store.ts'

import type { ArticlesState } from './postSlice.d'

const initialState: ArticlesState = {
  articles: [],
  totalArticles: 0,
}

export const articlesSlice: Slice<ArticlesState> = createSlice({
  name: '@articles',
  initialState,
  reducers: {},
})

export const articlesSelector = (state: RootStateType) => state.articles

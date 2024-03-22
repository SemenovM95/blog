import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const apiURL = 'https://blog.kata.academy/api'

export interface ArticleType {
  slug: string
  title: string
  description: string
  body: string
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: {
    username: string
    bio: string
    image: string
    following: boolean
  }
  tagList: string[]
}

export interface ArticlesResponseData {
  articles: ArticleType[]
  articlesCount: number
}

export interface ArticleResponseData {
  article: ArticleType
}

export interface AuthData {
  email: string
  password: string
}

export interface RegisterData extends AuthData {
  username: string
}

export interface UserData {
  email: string
  token: string
  username: string
  bio: string
  image: string
}

export interface AuthResponseData {
  user: UserData
}

export interface ErrorData {
  data: { errors: { [key: string]: string } }
  status: number
}

export interface ArticleFormData {
  title: string
  description: string
  body: string
  tagList: string[]
}

export const postLimit: number = 5

export const api = createApi({
  reducerPath: 'articleApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiURL }),
  tagTypes: ['Articles', 'UserData'],
  endpoints: (builder) => ({
    getArticlesPage: builder.query<ArticlesResponseData, number>({
      query: (page) => ({
        url: '/articles',
        params: { offset: Math.max((page - 1) * postLimit, 0), limit: postLimit },
      }),
      providesTags: ['Articles'],
    }),
    getFavoritedArticles: builder.query<ArticleType[], string>({
      query: (username) => ({
        url: '/articles',
        params: { favorited: username },
      }),
      transformResponse: (response: ArticlesResponseData): ArticleType[] => {
        return response.articles
      },
      providesTags: ['Articles'],
    }),
    getArticle: builder.query<ArticleType, string>({
      query: (slug) => ({ url: `/articles/${slug}` }),
      transformResponse: (response: ArticleResponseData): ArticleType => {
        return response.article
      },
    }),
    favoriteArticle: builder.mutation<ArticleType, { slug: string; token: string }>({
      query: ({ slug, token }) => ({
        url: `/articles/${slug}/favorite`,
        method: 'POST',
        headers: { Authorization: `Token ${token}` },
      }),
      invalidatesTags: ['Articles'],
    }),
    unfavoriteArticle: builder.mutation<ArticleType, { slug: string; token: string }>({
      query: ({ slug, token }) => ({
        url: `/articles/${slug}/favorite`,
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      }),
      invalidatesTags: ['Articles'],
    }),
    login: builder.mutation<AuthResponseData['user'], AuthData>({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: { user: credentials },
      }),
      transformResponse: (response: AuthResponseData) => {
        return response.user
      },
      transformErrorResponse: (response: ErrorData) => {
        const { errors } = response.data
        const stringifiedErr = Object.entries(errors)[0].join(' ')
        return stringifiedErr.charAt(0).toUpperCase() + stringifiedErr.slice(1)
      },
      invalidatesTags: ['UserData'],
    }),
    register: builder.mutation<AuthResponseData['user'], RegisterData>({
      query: (credentials) => ({
        url: '/users',
        method: 'POST',
        body: {
          user: credentials,
        },
      }),
      transformResponse: (response: AuthResponseData) => {
        const { token } = response.user
        if (token) sessionStorage.setItem('token', token)
        return response.user
      },
      transformErrorResponse: (response: ErrorData) => {
        const { errors } = response.data
        const stringifiedErr = Object.entries(errors)[0].join(' ')
        return stringifiedErr.charAt(0).toUpperCase() + stringifiedErr.slice(1)
      },
    }),
    getCurrentUser: builder.query<UserData, string>({
      query: (token: string) => ({
        url: '/user',
        headers: { Authorization: `Token ${token}` },
      }),
      transformResponse: (response: AuthResponseData) => {
        return response.user
      },
    }),
    updateCurrentUser: builder.mutation<UserData, { user: Partial<UserData>; token: string }>({
      query: ({ user, token }) => ({
        url: '/user',
        method: 'PUT',
        body: { user },
        headers: { Authorization: `Token ${token}` },
      }),
      transformResponse: (response: AuthResponseData) => {
        return response.user
      },
      transformErrorResponse: (response: ErrorData) => {
        const { errors } = response.data
        if (errors.message) return errors.message
        const stringifiedErr = Object.entries(errors)[0].join(' ')
        return stringifiedErr.charAt(0).toUpperCase() + stringifiedErr.slice(1)
      },
    }),
    createArticle: builder.mutation<ArticleType, { article: ArticleFormData; token: string }>({
      query: ({ article, token }) => ({
        url: '/articles',
        method: 'POST',
        body: { article },
        headers: {
          Authorization: `Token ${token}`,
        },
        invalidatesTags: ['Articles'],
      }),
      transformResponse: (response: ArticleResponseData) => {
        return response.article
      },
      transformErrorResponse: (response: ErrorData) => {
        return response.data.errors
      },
    }),
    editArticle: builder.mutation<
      ArticleType,
      { slug: string; article: Exclude<ArticleFormData, ArticleFormData['tagList']>; token: string }
    >({
      query: ({ slug, article, token }) => ({
        url: `/articles/${slug}`,
        method: 'PUT',
        body: { article },
        headers: {
          Authorization: `Token ${token}`,
        },
        invalidatesTags: ['Articles'],
      }),
      transformResponse: (response: ArticleResponseData) => {
        return response.article
      },
      transformErrorResponse: (response: ErrorData) => {
        return response.data.errors
      },
    }),
    deleteArticle: builder.mutation<{}, { slug: string; token: string }>({
      query: ({ slug, token }) => ({
        url: `/articles/${slug}`,
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
      invalidatesTags: ['Articles'],
    }),
  }),
})

export default api

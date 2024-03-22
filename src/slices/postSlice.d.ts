import type { Article } from 'src/services/RWBService'

export interface ArticlesState {
  articles: Article[]
  totalArticles: number
}
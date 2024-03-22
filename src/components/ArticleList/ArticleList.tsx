import { useEffect } from 'react'
import { Pagination } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'

import Article from 'src/components/Article/Article.tsx'
import { postLimit, ArticleType, api } from 'src/services/RWBService.ts'
import Spinner from 'components/ui/Spinner.tsx'
import useAuth from 'src/hooks/useAuth.tsx'

import style from './ArticleList.module.scss'

function ArticleList() {
  const { user, isAuth } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page'))
  const { data, isLoading } = api.useGetArticlesPageQuery(page)
  const [getFavoritedArticles, { data: favoritedArticles, isLoading: isLoadingFavorited }] =
    api.useLazyGetFavoritedArticlesQuery()

  const onPageChange = (newPage: number) => {
    navigate(`/articles?page=${newPage}`)
  }

  const setFavorited = (slug: string) => {
    if (isLoadingFavorited || !favoritedArticles) return false
    const found = favoritedArticles.findIndex((favorited: ArticleType) => favorited.slug === slug)
    return found >= 0
  }

  useEffect(() => {
    if (page) onPageChange(page)
    else onPageChange(1)
  }, [])

  useEffect(() => {
    if (isAuth && user) {
      getFavoritedArticles(user.username, true)
    }
  }, [isAuth, user])

  return (
    (isLoading && <Spinner centered />) ||
    (!isLoading && (
      <section className={style.articleList}>
        <ul className={style.articleList__list}>
          {data?.articles.map((article: ArticleType) => (
            <Article
              key={article.slug + Math.random() * 1000}
              article={{
                ...article,
                favorited: setFavorited(article.slug),
              }}
            />
          ))}
        </ul>
        <Pagination
          className={style.articleList__pagination}
          current={page}
          pageSize={postLimit}
          total={data?.articlesCount}
          showSizeChanger={false}
          onChange={(newPage) => onPageChange(newPage)}
        />
      </section>
    ))
  )
}

export default ArticleList

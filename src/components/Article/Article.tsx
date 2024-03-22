import { Link, useNavigate, useParams } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Popconfirm } from 'antd'

import {
  useGetArticleQuery,
  ArticleType,
  useDeleteArticleMutation,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from 'src/services/RWBService.ts'
import { formatDate } from 'src/utils/helpers.ts'
import useAuth from 'src/hooks/useAuth.tsx'

import type { ArticleProps } from './Article.d'
import style from './Article.module.scss'

export default function Article({ article, fullSize }: ArticleProps) {
  const navigate = useNavigate()
  const { isAuth, user } = useAuth()
  const [deleteArticle] = useDeleteArticleMutation()
  const [favoriteArticle] = useFavoriteArticleMutation()
  const [unfavoriteArticle] = useUnfavoriteArticleMutation()
  const renderArticle = (data: ArticleType) => {
    const {
      title,
      description,
      createdAt,
      tagList,
      favorited,
      favoritesCount,
      author: { username, image },
      slug,
    } = data

    const onArticleDelete = () => {
      if (isAuth && user?.token)
        deleteArticle({ slug, token: user?.token })
          .unwrap()
          .then(() => navigate('/articles'))
          .catch()
    }

    const onArticleFavorite = () => {
      if (!isAuth || !user?.token) return
      if (favorited) unfavoriteArticle({ slug, token: user?.token })
      else favoriteArticle({ slug, token: user?.token })
    }

    return (
      <div className={style.article__head}>
        <div className={style.article__content}>
          <Link to={`/articles/${slug}`} className={style.article__title}>
            <h5 className={style.article__title}>{(title.trim().length && title) || 'No title'}</h5>
          </Link>
          <span className={style.article__rating}>
            <button type="button" onClick={() => onArticleFavorite()}>
              <img src={favorited ? '/heart-red.svg' : '/heart.svg'} alt="Like" />
            </button>
            {favoritesCount}
          </span>
          {tagList.length > 0 && (
            <div className={style.article__tags}>
              {tagList.map((tag, idx) => {
                return (
                  tag && (
                    // eslint-disable-next-line react/no-array-index-key
                    <span className={style.article__tag} key={idx}>
                      {tag}
                    </span>
                  )
                )
              })}
            </div>
          )}
          <p className={style.article__description}>{description}</p>
        </div>
        <div>
          <div className={style.article__author}>
            <div className={style.article__authorData}>
              <span className={style.article__authorUsername}>{username}</span>
              <span className={style.article__authorDate}>{formatDate(createdAt)}</span>
            </div>
            <img className={style.article__authorAvatar} src={image} alt="avatar" />
          </div>
          {fullSize && isAuth && user?.username === username && (
            <div className={style.article__actions}>
              <Popconfirm title="Are you sure to delete this article?" onConfirm={onArticleDelete}>
                <button type="button" className={`${style.article__actions__action} ${style.article__actions__delete}`}>
                  Delete
                </button>
              </Popconfirm>
              <Link
                to={`/articles/${slug}/edit`}
                className={`${style.article__actions__action} ${style.article__actions__edit}`}
              >
                Edit
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (fullSize) {
    const { id } = useParams()
    const { data, isLoading } = useGetArticleQuery(id as string)
    if (isLoading || !data) return <p>Loading...</p>
    return (
      <div className={`${style.article} ${style.articleFullSize}`}>
        {renderArticle(data)}
        <div className={style.article__body}>
          <Markdown remarkPlugins={[remarkGfm]}>{data.body}</Markdown>
        </div>
      </div>
    )
  }
  return <div className={`${style.article}`}>{article && renderArticle(article)}</div>
}

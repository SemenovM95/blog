import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import { useCreateArticleMutation, useEditArticleMutation, useGetArticleQuery } from 'src/services/RWBService.ts'
import Form from 'components/ui/Form.tsx'
import Input from 'components/ui/Input.tsx'
import useAuth from 'src/hooks/useAuth.tsx'
import Spinner from 'components/ui/Spinner.tsx'

import style from './ArticleForm.module.scss'

interface Tag {
  value: string
}
interface ArticleFormFields {
  title: string
  description: string
  text: string
  tags: Tag[]
}
interface ArticleFormData {
  isEditing?: boolean
}

export default function ArticleForm({ isEditing }: ArticleFormData) {
  const navigate = useNavigate()
  const { slug } = useParams()
  const { getToken, user } = useAuth()
  const [createArticle, { isLoading: isLoadingCreate }] = useCreateArticleMutation()
  const [updateArticle, { isLoading: isLoadingUpdate }] = useEditArticleMutation()
  const { data: articleData, isLoading: isLoadingArticle } = useGetArticleQuery(slug, { skip: !isEditing })

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ArticleFormFields>({
    defaultValues: {
      title: '',
      description: '',
      text: '',
      tags: [{ value: '' }],
    },
  })
  const { fields: tagFields, append, remove } = useFieldArray<ArticleFormFields>({ name: 'tags', control })

  const onSubmit: SubmitHandler<ArticleFormFields> = (data: ArticleFormFields) => {
    const article = {
      title: data.title,
      description: data.description,
      body: data.text,
      tagList: data.tags.map((tag) => tag.value),
    }
    const token = getToken()
    if (token)
      if (isEditing && slug)
        updateArticle({ slug, article, token })
          .unwrap()
          .then(() => navigate(`/article/${slug}`))
          .catch((err) => console.error(err))
      else
        createArticle({ article, token })
          .unwrap()
          .then(() => navigate(`/article/${slug}`))
          .catch((err) => console.error(err))
  }

  useEffect(() => {
    if (isEditing && articleData) {
      const rehydrateData = {
        title: articleData.title,
        description: articleData.description,
        text: articleData.body,
        tags: articleData.tagList.map((tag) => ({ value: tag })),
      }
      reset(rehydrateData)
    }
  }, [isLoadingArticle, articleData, isEditing])

  useEffect(() => {
    if (user && articleData) {
      if (user.username !== articleData.author.username) navigate('/', { replace: true })
    }
  }, [user, articleData])

  return (
    <section className={style.acticleForm}>
      {(isLoadingCreate || isLoadingUpdate || isLoadingArticle) && <Spinner centered />}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2 className={style.acticleForm__title}>{isEditing ? 'Edit article' : 'Create new article'}</h2>
        <div className={style.acticleForm__fields}>
          <Input
            label="Title"
            placeholder="Title"
            {...register('title', {
              required: 'This field is required',
            })}
          />
          {errors.title && <p className={style.acticleForm__error}>{errors.title.message}</p>}
          <Input
            label="Short description"
            placeholder="Short description"
            {...register('description', {
              required: 'This field is required',
            })}
          />
          {errors.description && <p className={style.acticleForm__error}>{errors.description.message}</p>}
          <p className={style.acticleForm__textareaLabel}>Text</p>
          <textarea
            className={`${style.acticleForm__textarea} ${errors.text ? style.acticleForm__textareaError : null}`}
            rows={8}
            placeholder="Text"
            {...register('text', {
              required: 'This field is required',
            })}
          />
          {errors.text && <p className={style.acticleForm__error}>{errors.text.message}</p>}
          <ul className={style.acticleForm__tagsList}>
            Tags
            {tagFields.map((field, index) => (
              <li key={field.id} className={style.acticleForm__tagsItem}>
                <Input
                  type="text"
                  size="sm"
                  placeholder="Tag"
                  {...register(`tags.${index}.value`)}
                  defaultValue={field.value}
                />
                {tagFields.length > 1 && (
                  <button
                    type="button"
                    className={`${style.acticleForm__tagsButtonDelete} ${style.acticleForm__tagsButton}`}
                    onClick={() => remove(index)}
                  >
                    Delete
                  </button>
                )}
                {index === tagFields.length - 1 && (
                  <button
                    type="button"
                    className={`${style.acticleForm__tagsButtonAdd} ${style.acticleForm__tagsButton}`}
                    onClick={() => append({ value: '' })}
                  >
                    Add tag
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" className={style.acticleForm__button}>
          Send
        </button>
      </Form>
    </section>
  )
}

ArticleForm.defaultProps = {
  isEditing: false,
}

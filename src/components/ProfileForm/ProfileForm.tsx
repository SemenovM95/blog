import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { api } from 'src/services/RWBService.ts'
import Form from 'components/ui/Form.tsx'
import Input from 'components/ui/Input.tsx'
import useAuth from 'src/hooks/useAuth.tsx'
import Spinner from 'components/ui/Spinner.tsx'

import style from './ProfileForm.module.scss'

interface ProfileFormFields {
  username: string
  email: string
  password: string
  image: string
}

export default function ProfileForm() {
  const { getToken, isAuth } = useAuth()
  const [updateUserError, setUpdateUserError] = useState<string | false>(false)
  const [getUserdata, { data: userData, isFetching: isGettingUserData }] = api.useLazyGetCurrentUserQuery()
  const [updateUser, { isLoading: isUpdatingUser }] = api.useUpdateCurrentUserMutation()
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ProfileFormFields>({
    defaultValues: {
      username: userData?.username || '',
      email: userData?.email || '',
      password: '',
      image: userData?.image || '',
    },
  })

  const onSubmit: SubmitHandler<ProfileFormFields> = (data: ProfileFormFields) => {
    const token = getToken()
    if (token) {
      updateUser({ user: data, token })
        .unwrap()
        .then(() => getUserdata(token))
        .catch((err) => setUpdateUserError(err))
    }
  }

  useEffect(() => {
    if (isAuth && userData) {
      reset({ username: userData.username, email: userData.email, password: '', image: userData.image })
    }
  }, [userData, isGettingUserData])

  useEffect(() => {
    const token = getToken()
    if (isAuth && token) {
      getUserdata(token)
    }
  }, [isAuth])

  return (
    <div className={style.profile}>
      {(isGettingUserData || isUpdatingUser) && <Spinner size="md" centered />}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2 className={style.profile__title}>Edit Profile</h2>
        <div className={style.profile__fields}>
          <Input
            type="text"
            label="Username"
            placeholder="Username"
            {...register('username', { required: 'This field is required' })}
            status={errors.username ? 'error' : 'default'}
          />
          {errors.username && <p className={style.profile__error}>{errors.username?.message}</p>}
          <Input
            type="email"
            label="Email"
            placeholder="Email"
            autoComplete="email"
            {...register('email', { required: 'This field is required', pattern: /^\S+@\S+$/i })}
            status={errors.email ? 'error' : 'default'}
          />
          {errors.email && <p className={style.profile__error}>{errors.email?.message}</p>}
          <Input
            type="password"
            label="New password"
            placeholder="New password"
            autoComplete="new-password"
            {...register('password', { required: 'This field is required' })}
            status={errors.password ? 'error' : 'default'}
          />
          {errors.password && <p className={style.profile__error}>{errors.password?.message}</p>}
          <Input
            type="text"
            label="Avatar image (url)"
            placeholder="Avatar image"
            {...register('image', {
              required: 'This field is required',
              validate: (url: string) => {
                return new Promise((resolve) => {
                  const img = new Image()
                  img.onload = () => resolve(true)
                  img.onerror = () => resolve('Must be a valid image URL')
                  img.src = url
                })
              },
            })}
            status={errors.image ? 'error' : 'default'}
          />
          {errors.image && <p className={style.profile__error}>{errors.image?.message}</p>}
          {updateUserError && <p className={style.profile__error}>{updateUserError}</p>}
        </div>
        <button type="submit" className={style.profile__button}>
          Save
        </button>
      </Form>
    </div>
  )
}

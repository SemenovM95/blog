import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import Form, { FormFieldProps } from 'components/ui/Form.tsx'
import useAuth from 'src/hooks/useAuth.tsx'

import styles from './LoginForm.module.scss'

interface LoginFormFields {
  email: string
  password: string
}
export default function LoginForm() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({ mode: 'onSubmit', reValidateMode: 'onChange' })
  const { isAuth, loginUser, isLoadingLogin, authError } = useAuth()

  const onSubmit: SubmitHandler<LoginFormFields> = async (credentials) => {
    await loginUser(credentials).then((success) => success && navigate('/'))
  }

  useEffect(() => {
    if (isAuth) navigate('/')
  }, [isAuth])

  const fields: Partial<FormFieldProps>[] = [
    {
      name: 'email',
      label: 'Email address',
      type: 'text',
      placeholder: 'Email address',
      autoComplete: 'email',
      rules: {
        required: 'This field is required',
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
          message: 'Please enter a valid email',
        },
      },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Password',
      autoComplete: 'current-password',
      rules: {
        required: 'This field is required',
      },
    },
  ]

  const generateFrom = {
    title: 'Sign In',
    fields,
    submitText: 'Login',
    loading: isLoadingLogin,
    serverError: authError,
    register,
    errors,
  }

  return (
    <div className={styles.login}>
      {/* TODO: fix types */}
      {/* @ts-ignore */}
      <Form generateFrom={generateFrom} onSubmit={handleSubmit(onSubmit)}>
        <p className={styles.login__signUp}>
          Don&apos;t have an account? <Link to="/sign-up">Sign Up</Link>.
        </p>
      </Form>
    </div>
  )
}

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { useRegisterMutation } from 'src/services/RWBService.ts'
import Form, { FormFieldProps } from 'components/ui/Form.tsx'

import styles from './RegisterForm.module.scss'

interface RegisterFormInputs {
  username: string
  email: string
  password: string
  confirmPassword: string
  agreement: boolean
}

export default function RegisterForm() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormInputs>({ mode: 'onSubmit', reValidateMode: 'onChange' })
  const [signUp, { isLoading }] = useRegisterMutation()
  const [regError, setRegError] = useState<string | false>(false)

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    await signUp({ username: data.username, email: data.email, password: data.password })
      .unwrap()
      .then(() => navigate('/sign-in'))
      .catch((err) => setRegError(err))
  }

  const fields: Partial<FormFieldProps>[] = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Username',
      autoComplete: 'username',
      rules: {
        required: 'This field is required',
        minLength: {
          value: 3,
          message: 'Username must be at least 3 characters',
        },
        maxLength: {
          value: 20,
          message: 'Username must be less than 20 characters',
        },
      },
    },
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
      autoComplete: 'new-password',
      rules: {
        required: 'This field is required',
        minLength: {
          value: 6,
          message: 'Password must be at least 6 characters',
        },
      },
    },
    {
      name: 'confirmPassword',
      label: 'Confirm password',
      type: 'password',
      placeholder: 'Confirm password',
      autoComplete: 'new-password',
      rules: {
        required: 'This field is required',
        validate: (value: any) => value === watch('password') || 'Passwords do not match',
      },
    },
    {
      name: 'agreement',
      label: 'I agree to the processing of my personal data',
      type: 'checkbox',
      rules: {
        required: 'This field is required',
      },
    },
  ]

  const generateFrom = {
    title: 'Create new account',
    fields,
    register,
    errors,
    loading: isLoading,
    submitText: 'Sign up',
    serverError: regError,
  }

  return (
    <section className={styles.register}>
      {/* TODO: fix types */}
      {/* @ts-ignore */}
      <Form generateFrom={generateFrom} onSubmit={handleSubmit(onSubmit)} />
      <p className={styles.register__signUp}>
        Already have an account? <Link to="/sign-in">Sign In</Link>.
      </p>
    </section>
  )
}

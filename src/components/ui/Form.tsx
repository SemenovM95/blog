import { forwardRef, JSX } from 'react'

import Input from 'components/ui/Input.tsx'
import Spinner from 'components/ui/Spinner.tsx'

import styles from './Form.module.scss'

export interface FormRule {
  required?: boolean | string
  minLength?: number | { value: number; message: string }
  maxLength?: number | { value: number; message: string }
  pattern?: RegExp | { value: RegExp; message: string }
  // eslint-disable-next-line no-unused-vars
  validate?: (value: any) => boolean | string
}

export interface FormFieldProps {
  name: string
  label: string
  type: string
  placeholder: string
  autoComplete?: string | false
  rules: FormRule
  status: string
  showError?: boolean
  size?: 'md' | 'lg' | 'full'
}

export interface FormGenerationProps {
  fields: FormFieldProps[]
  register?: any | false
  errors?: any | false
  title?: JSX.Element | string | false
  loading?: boolean
  submitText?: string
  serverError?: string | false
  children?: JSX.Element[]
}

export interface FormProps {
  generateFrom?: FormGenerationProps | false
  children?: JSX.Element | JSX.Element[]
  // eslint-disable-next-line no-unused-vars
  onSubmit: (...args: any[]) => any
}

const Form = forwardRef<HTMLFormElement, FormProps>(({ generateFrom, children, onSubmit }: FormProps, ref) => {
  let fields
  let title
  let register: any
  let errors: any
  let loading
  let submitText
  let serverError

  if (generateFrom) {
    fields = generateFrom.fields
    title = generateFrom.title
    register = generateFrom.register
    errors = generateFrom.errors
    loading = generateFrom.loading
    submitText = generateFrom.submitText
    serverError = generateFrom.serverError
  }

  return (
    <form ref={ref} onSubmit={onSubmit}>
      {!!generateFrom && (
        <>
          {title && typeof title === 'string' ? <h2 className={styles.form__title}>{title}</h2> : title}
          {loading && (
            <div className={styles.form__spinner}>
              <Spinner centered />
            </div>
          )}
          {fields && (
            <div className={styles.form__fields}>
              {fields.map((field: FormFieldProps) => (
                <span className={styles.form__field} key={field.name}>
                  <Input
                    {...field}
                    {...register(field.name, field.rules)}
                    status={errors[field.name] ? 'error' : 'default'}
                  />
                  <p className={styles.form__error}>{errors[field.name]?.message}</p>
                </span>
              ))}
            </div>
          )}
          {serverError && <p className={`${styles.form__error} ${styles.form__serverError}`}>{serverError}</p>}
          <button type="submit" className={styles.form__button}>
            {submitText}
          </button>
        </>
      )}
      {children}
    </form>
  )
})

Form.defaultProps = {
  generateFrom: false,
  children: undefined,
}

Form.displayName = 'Form'

export default Form

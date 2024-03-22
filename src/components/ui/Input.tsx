import { forwardRef } from 'react'

import styles from './Input.module.scss'

export interface InputProps {
  type?: 'text' | 'password' | 'email' | 'checkbox'
  placeholder?: string
  label?: string
  autoComplete?: string
  size?: 'sm' | 'md' | 'lg' | 'full'
  status?: 'success' | 'error' | 'warning' | 'default'
  register?: any
  defaultValue?: string | undefined
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size, status, register, label, type, ...props }: InputProps, ref) => {
    const inputClasses = () =>
      `${styles.input} ${size ? styles[`input--${size}`] : ''} ${status ? styles[`input--${status}`] : ''}`

    return (
      (label &&
        (type === 'checkbox' ? (
          <label className={styles.checkbox}>
            <input type="checkbox" {...props} ref={ref} className={styles.checkbox__input} {...register} />
            <span className={styles.checkbox__check} />
            {label && <span className={styles.checkbox__label}>{label}</span>}
          </label>
        ) : (
          <label className={styles.label}>
            {label}
            <input ref={ref} type={type} {...props} className={inputClasses()} {...register} />
          </label>
        ))) || <input type={type} {...props} ref={ref} className={inputClasses()} {...register} />
    )
  }
)

Input.displayName = 'Input'

Input.defaultProps = {
  type: 'text',
  placeholder: '',
  label: '',
  autoComplete: 'off',
  size: 'full',
  status: 'default',
  register: null,
  defaultValue: undefined,
}
export default Input

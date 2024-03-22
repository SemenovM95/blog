import type { FormRule } from 'antd'

export interface FormFieldProps {
  name: string
  label: string
  type: string
  placeholder: string
  rules: FormRule
  status: string
}

export interface LoginFormProps {
  onSubmit: (data: RegisterFormInputs) => void
  control: any
  fields: []
}
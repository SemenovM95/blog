import { forwardRef, JSX } from 'react'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  children?: JSX.Element | JSX.Element[] | string | undefined
}

const Button = forwardRef(({ children, type, ...props }: ButtonProps, ref) => {
  return (
    // @ts-ignore
    <button type="button" ref={ref} {...props}>
      {children}
    </button>
  )
})

Button.displayName = 'Button'

Button.defaultProps = {
  type: 'button',
  children: undefined,
}

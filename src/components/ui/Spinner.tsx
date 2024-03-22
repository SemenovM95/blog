import style from './Spinner.module.scss'

interface SpinnerProps {
  centered?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  [key: string]: any
}

export default function Spinner({ centered, size, ...props }: SpinnerProps) {
  return (
    <img
      src="/Spinner.svg"
      alt="Loading"
      itemType="image/svg+xml"
      className={`${centered && style.centered} ${size && style[size]}`}
      {...props}
    />
  )
}

Spinner.defaultProps = {
  centered: false,
  size: 'lg',
}

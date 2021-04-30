import { FC, MouseEventHandler } from 'react'

interface ButtonProps {
  color?: 'blue' | 'black' | 'purple'
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
  text?: boolean
  loading?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
}
const Button: FC<ButtonProps> = ({ block, color = 'blue', text = false, loading = false, ...props }) => {
  let btnClass
  if (color === 'blue') btnClass = 'btn-large bg-blue focus:ring-white'
  else if (color === 'black') btnClass = 'btn-large bg-black focus:ring-white'
  else if (color === 'purple') btnClass = 'text-link-off bg-sec hover:bg-prim hover:text-link-on rounded-md'
  // default class
  const classes =
    ' min-w-but w-full px-6 py-2 rounded-lg hover:ring-1 hover:ring-opacity-40 ring-offset-2 focus:ring-1 focus:ring-opacity-40'

  // if type is block
  const blockClass = block ? 'w-full' : ''

  // assign classes based on button variant
  const textClass = 'text-white'

  const disabledClass = loading ? 'cursor-not-allowed opacity-50' : ''

  return (
    <div className='relative'>
      <button
        {...props}
        disabled={loading}
        className={[classes, btnClass, textClass, blockClass, disabledClass].join(' ')}
      >
        {props.children}
      </button>
    </div>
  )
}

export default Button

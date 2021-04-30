import { FC } from 'react'

const Card: FC = ({ children }) => {
  return (
    <div className='flex justify-center w-full'>
      <div className='w-11/12 shadow-md rounded-lg space-y-2'>{children}</div>
    </div>
  )
}
export default Card

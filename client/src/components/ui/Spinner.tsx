import type { FC } from 'react'

interface SpinnerProps {
  label?: string
  dark?: boolean
}

const Spinner: FC<SpinnerProps> = ({ label, dark = false }) => {
  return (
    <div className='loading-screen' role='status' aria-live='polite'>
      <div className={`spinner ${dark ? 'spinner--dark' : ''}`} aria-hidden='true' />
      {label && <span>{label}</span>}
    </div>
  )
}

export default Spinner

import type { FC } from 'react'
import { Link } from 'react-router-dom'
import StatusMessage from '../components/ui/StatusMessage'

const NotFound: FC = () => {
  return (
    <main className='page-container'>
      <StatusMessage empty emptyMessage='Page not found.'>
        <Link to='/' className='btn btn--primary'>
          Back to films
        </Link>
      </StatusMessage>
    </main>
  )
}

export default NotFound

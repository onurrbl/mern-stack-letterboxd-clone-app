import type { FC, ReactNode } from 'react'
import Spinner from './Spinner'

interface StatusMessageProps {
  variant?: 'default' | 'dark'
  loading?: boolean
  loadingLabel?: string
  error?: string | null
  empty?: boolean
  emptyMessage?: string
  onRetry?: () => void
  retryLabel?: string
  children?: ReactNode
}

const StatusMessage: FC<StatusMessageProps> = ({
  variant = 'default',
  loading = false,
  loadingLabel = 'Loading...',
  error,
  empty = false,
  emptyMessage = 'Nothing here yet.',
  onRetry,
  retryLabel = 'Try again',
  children,
}) => {
  if (loading) {
    return <Spinner label={loadingLabel} dark={variant === 'dark'} />
  }

  if (error) {
    return (
      <div className={`status-panel ${variant === 'dark' ? 'status-panel--dark' : ''}`}>
        <p className='status-panel__message status-panel__message--error'>{error}</p>
        <div className='status-panel__actions'>
          {onRetry && (
            <button type='button' className='btn btn--primary' onClick={onRetry}>
              {retryLabel}
            </button>
          )}
          {children}
        </div>
      </div>
    )
  }

  if (empty) {
    return (
      <div className={`status-panel ${variant === 'dark' ? 'status-panel--dark' : ''}`}>
        <p className='status-panel__message'>{emptyMessage}</p>
        {children && <div className='status-panel__actions'>{children}</div>}
      </div>
    )
  }

  return null
}

export default StatusMessage

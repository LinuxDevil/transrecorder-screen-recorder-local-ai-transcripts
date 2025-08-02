import { MessageType } from '../types'

/**
 * Determine the message type based on content
 */
export const getMessageType = (message: string): MessageType => {
  if (message.includes('✅')) return 'success'
  if (message.includes('❌')) return 'error'
  if (message.includes('🔄')) return 'loading'
  return 'info'
}

/**
 * Get CSS classes for message styling based on type
 */
export const getMessageClasses = (type: MessageType): string => {
  switch (type) {
    case 'success':
      return 'status-message-success'
    case 'error':
      return 'status-message-error'
    case 'loading':
      return 'status-message-loading'
    default:
      return 'status-message-info'
  }
}

/**
 * Get button classes based on state
 */
export const getButtonClasses = (
  variant: 'primary' | 'secondary' | 'success' | 'danger',
  disabled: boolean = false
): string => {
  const baseClasses = 'btn'

  if (disabled) {
    return `${baseClasses} btn-disabled`
  }

  switch (variant) {
    case 'primary':
      return `${baseClasses} btn-primary`
    case 'secondary':
      return `${baseClasses} btn-secondary`
    case 'success':
      return `${baseClasses} btn-success`
    case 'danger':
      return `${baseClasses} btn-danger`
    default:
      return `${baseClasses} btn-secondary`
  }
}

import React from 'react'
import { getMessageType, getMessageClasses } from '../utils/ui.utils'
import { CheckCircleIcon, AlertCircleIcon, LoaderIcon } from './icons'

interface StatusMessagesProps {
  saveMessage: string
  transcriptMessage: string
}

export const StatusMessages: React.FC<StatusMessagesProps> = ({
  saveMessage,
  transcriptMessage
}) => {
  const renderMessage = (message: string): React.JSX.Element | null => {
    if (!message) return null

    const messageType = getMessageType(message)
    const classes = getMessageClasses(messageType)

    return (
      <div className={`status-message ${classes}`}>
        {messageType === 'success' ? (
          <CheckCircleIcon />
        ) : messageType === 'error' ? (
          <AlertCircleIcon />
        ) : (
          <LoaderIcon />
        )}
        <div className="status-message-text">{message}</div>
      </div>
    )
  }

  return (
    <>
      {renderMessage(saveMessage)}
      {renderMessage(transcriptMessage)}
    </>
  )
}

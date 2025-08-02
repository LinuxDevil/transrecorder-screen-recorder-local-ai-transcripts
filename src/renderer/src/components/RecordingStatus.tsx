import React from 'react'

interface RecordingStatusProps {
  isRecording: boolean
}

export const RecordingStatus: React.FC<RecordingStatusProps> = ({ isRecording }) => {
  if (!isRecording) return null

  return (
    <div className="recording-status">
      <div className="recording-indicator"></div>
      <span className="recording-text">Recording in progress...</span>
      <span className="recording-badge">LIVE</span>
    </div>
  )
}

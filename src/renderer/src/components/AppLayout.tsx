import React from 'react'
import { Header } from './Header'
import { RecordingControls } from './RecordingControls'
import { StatusMessages } from './StatusMessages'
import { RecordingStatus } from './RecordingStatus'
import { VideoPreview } from './VideoPreview'
import { RecordingType } from '../types'

interface AppLayoutProps {
  isRecording: boolean
  isSaving: boolean
  isProcessingTranscript: boolean
  hasVideo: boolean
  recordingType: RecordingType
  saveMessage: string
  transcriptMessage: string
  previewVideoRef: React.RefObject<HTMLVideoElement | null>
  videoRef: React.RefObject<HTMLVideoElement | null>
  stream: MediaStream | null
  recordedVideo: string | null
  onRecordingTypeChange: (type: RecordingType) => void
  onStartRecording: () => Promise<void>
  onStopRecording: () => void
  onDownloadVideo: () => Promise<void>
  onProcessTranscript: () => Promise<void>
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  isRecording,
  isSaving,
  isProcessingTranscript,
  hasVideo,
  recordingType,
  saveMessage,
  transcriptMessage,
  previewVideoRef,
  videoRef,
  stream,
  recordedVideo,
  onRecordingTypeChange,
  onStartRecording,
  onStopRecording,
  onDownloadVideo,
  onProcessTranscript
}) => {
  return (
    <div className="app-container">
      <div className="app-content">
        <Header />

        <RecordingControls
          isRecording={isRecording}
          isSaving={isSaving}
          isProcessingTranscript={isProcessingTranscript}
          hasVideo={hasVideo}
          recordingType={recordingType}
          onRecordingTypeChange={onRecordingTypeChange}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          onDownloadVideo={onDownloadVideo}
          onProcessTranscript={onProcessTranscript}
        />

        <StatusMessages saveMessage={saveMessage} transcriptMessage={transcriptMessage} />

        <RecordingStatus isRecording={isRecording} />

        <VideoPreview
          stream={stream}
          recordedVideo={recordedVideo}
          previewVideoRef={previewVideoRef}
          videoRef={videoRef}
        />
      </div>
    </div>
  )
}

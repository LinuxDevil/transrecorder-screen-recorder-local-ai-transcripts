import React from 'react'
import { Header } from './Header/index'
import { RecordingControls } from './RecordingControls/index'
import { StatusMessages } from './StatusMessages/index'
import { RecordingStatus } from './RecordingStatus/index'
import { VideoPreview } from './VideoPreview/index'
import { ScreenSelector } from './ScreenSelector/index'
import { RecordingType, DesktopSource } from '../types'

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
  availableScreens: DesktopSource[]
  selectedScreen: DesktopSource | null
  onRecordingTypeChange: (type: RecordingType) => void
  onScreenSelect: (screen: DesktopSource | null) => void
  onRefreshScreens: () => Promise<void>
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
  availableScreens,
  selectedScreen,
  onRecordingTypeChange,
  onScreenSelect,
  onRefreshScreens,
  onStartRecording,
  onStopRecording,
  onDownloadVideo,
  onProcessTranscript
}) => {
  return (
    <div className="app-container">
      <div className="app-content">
        <Header />

        <ScreenSelector
          availableScreens={availableScreens}
          selectedScreen={selectedScreen}
          onScreenSelect={onScreenSelect}
          onRefreshScreens={onRefreshScreens}
        />

        <RecordingControls
          isRecording={isRecording}
          isSaving={isSaving}
          isProcessingTranscript={isProcessingTranscript}
          hasVideo={hasVideo}
          recordingType={recordingType}
          selectedScreen={selectedScreen}
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

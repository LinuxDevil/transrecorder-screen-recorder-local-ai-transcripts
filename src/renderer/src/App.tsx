import React from 'react'
import { AppLayout } from './components/AppLayout'
import { useRecording } from './hooks/useRecording'

export default function App(): React.JSX.Element {
  const {
    stream,
    isRecording,
    recordedVideo,
    isSaving,
    isProcessingTranscript,
    saveMessage,
    transcriptMessage,
    recordingType,
    hasVideo,
    videoRef,
    previewVideoRef,
    setRecordingType,
    startRecording,
    stopRecording,
    downloadVideo,
    processTranscript
  } = useRecording()

  return (
    <AppLayout
      isRecording={isRecording}
      isSaving={isSaving}
      isProcessingTranscript={isProcessingTranscript}
      hasVideo={hasVideo}
      recordingType={recordingType}
      saveMessage={saveMessage}
      transcriptMessage={transcriptMessage}
      previewVideoRef={previewVideoRef}
      videoRef={videoRef}
      stream={stream}
      recordedVideo={recordedVideo}
      onRecordingTypeChange={setRecordingType}
      onStartRecording={startRecording}
      onStopRecording={stopRecording}
      onDownloadVideo={downloadVideo}
      onProcessTranscript={processTranscript}
    />
  )
}

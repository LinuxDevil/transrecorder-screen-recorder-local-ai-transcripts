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
    availableScreens,
    selectedScreen,
    setRecordingType,
    setSelectedScreen,
    getAvailableScreens,
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
      availableScreens={availableScreens}
      selectedScreen={selectedScreen}
      onRecordingTypeChange={setRecordingType}
      onScreenSelect={setSelectedScreen}
      onRefreshScreens={getAvailableScreens}
      onStartRecording={startRecording}
      onStopRecording={stopRecording}
      onDownloadVideo={downloadVideo}
      onProcessTranscript={processTranscript}
    />
  )
}

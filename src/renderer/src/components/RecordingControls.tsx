import React from 'react'
import { RecordingType } from '../types'
import { getRecordingTypeIcon, getRecordingTypeLabel } from '../utils/recording.utils'
import { getButtonClasses } from '../utils/ui.utils'
import { PlayIcon, SquareIcon, DownloadIcon, FileTextIcon, LoaderIcon, VideoIcon } from './icons'

interface RecordingControlsProps {
  isRecording: boolean
  isSaving: boolean
  isProcessingTranscript: boolean
  hasVideo: boolean
  recordingType: RecordingType
  onRecordingTypeChange: (type: RecordingType) => void
  onStartRecording: () => void
  onStopRecording: () => void
  onDownloadVideo: () => void
  onProcessTranscript: () => void
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isSaving,
  isProcessingTranscript,
  hasVideo,
  recordingType,
  onRecordingTypeChange,
  onStartRecording,
  onStopRecording,
  onDownloadVideo,
  onProcessTranscript
}) => {
  return (
    <div className="controls-card">
      <div className="controls-header">
        <div className="controls-title">
          <div className="controls-icon">
            <VideoIcon />
          </div>
          <h2 className="controls-heading">Recording Controls</h2>
        </div>
        <p className="controls-description">Start and manage your screen recording session</p>
      </div>
      <div className="controls-content">
        <div className="controls-section">
          <label className="controls-label">Recording Type</label>
          <div className="controls-options">
            {Object.values(RecordingType).map((type) => (
              <label key={type} className="controls-option">
                <input
                  type="radio"
                  name="recordingType"
                  value={type}
                  checked={recordingType === type}
                  onChange={(e) => onRecordingTypeChange(e.target.value as RecordingType)}
                  className="controls-radio"
                />
                <div className="controls-option-content">
                  {getRecordingTypeIcon(type)}
                  {getRecordingTypeLabel(type)}
                </div>
              </label>
            ))}
          </div>
        </div>

        <hr className="controls-divider" />

        <div className="controls-buttons">
          <button
            onClick={onStartRecording}
            disabled={isRecording}
            className={getButtonClasses('danger', isRecording)}
          >
            {isRecording ? (
              <>
                <LoaderIcon />
                <span className="btn-icon">Recording...</span>
              </>
            ) : (
              <>
                <PlayIcon />
                <span className="btn-icon">Start Recording</span>
              </>
            )}
          </button>

          <button
            onClick={onStopRecording}
            disabled={!isRecording}
            className={getButtonClasses('secondary', !isRecording)}
          >
            <SquareIcon />
            <span className="btn-icon">Stop Recording</span>
          </button>

          <button
            onClick={onDownloadVideo}
            disabled={!hasVideo || isSaving}
            className={getButtonClasses('secondary', !hasVideo || isSaving)}
          >
            {isSaving ? (
              <>
                <LoaderIcon />
                <span className="btn-icon">Saving...</span>
              </>
            ) : (
              <>
                <DownloadIcon />
                <span className="btn-icon">Download Video</span>
              </>
            )}
          </button>

          <button
            onClick={onProcessTranscript}
            disabled={!hasVideo || isProcessingTranscript}
            className={getButtonClasses('success', !hasVideo || isProcessingTranscript)}
          >
            {isProcessingTranscript ? (
              <>
                <LoaderIcon />
                <span className="btn-icon">Processing...</span>
              </>
            ) : (
              <>
                <FileTextIcon />
                <span className="btn-icon">Extract Transcript</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

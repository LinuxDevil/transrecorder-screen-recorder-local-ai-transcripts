import React from 'react'
import { RecordingType } from '../types'
import { UsersIcon, GraduationCapIcon, MonitorIcon } from '../components/icons'

/**
 * Get the appropriate icon for a recording type
 */
export const getRecordingTypeIcon = (type: RecordingType): React.JSX.Element => {
  switch (type) {
    case RecordingType.GOOGLE_MEET:
      return React.createElement(UsersIcon)
    case RecordingType.LESSON:
      return React.createElement(GraduationCapIcon)
    case RecordingType.VIDEO:
      return React.createElement(MonitorIcon)
  }
}

/**
 * Get the display label for a recording type
 */
export const getRecordingTypeLabel = (type: RecordingType): string => {
  switch (type) {
    case RecordingType.GOOGLE_MEET:
      return 'Google Meet'
    case RecordingType.LESSON:
      return 'Lesson'
    case RecordingType.VIDEO:
      return 'Screen Recording'
  }
}

/**
 * Generate a filename with current timestamp
 */
export const generateFilename = (): string => {
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0]
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-')
  return `recording-${dateStr}-${timeStr}`
}

/**
 * Generate a filename for transcript processing
 */
export const generateTranscriptFilename = (): string => {
  return `recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`
}

/**
 * Get the MIME type for video recording
 */
export const getVideoMimeType = (): string => {
  return MediaRecorder.isTypeSupported('video/webm; codecs=vp9')
    ? 'video/webm; codecs=vp9'
    : MediaRecorder.isTypeSupported('video/webm; codecs=vp8')
      ? 'video/webm; codecs=vp8'
      : 'video/webm'
}

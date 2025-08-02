export interface SaveVideoResponse {
  success: boolean
  videoPath?: string
  transcriptPath?: string
  message: string
  error?: string
}

export interface ProcessTranscriptResponse {
  success: boolean
  transcript?: string
  summary?: string
  transcriptPath?: string
  summaryPath?: string
  message: string
  error?: string
}

export interface DesktopSource {
  id: string
  name: string
  thumbnail: Electron.NativeImage
  display_id: string
  appIcon: Electron.NativeImage | null
}

export enum RecordingType {
  GOOGLE_MEET = 'google_meet',
  LESSON = 'lesson',
  VIDEO = 'video'
}

export interface FilePaths {
  desktopPath: string
  dateDir: string
  videoPath: string
  transcriptPath: string
  summaryPath: string
}

export interface PythonScriptResult {
  audio_path: string
  whisper_transcript?: string
  google_transcript?: string
  success: boolean
}

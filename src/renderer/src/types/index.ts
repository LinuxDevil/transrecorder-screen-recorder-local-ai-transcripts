export interface DesktopCaptureConstraints {
  mandatory: {
    chromeMediaSource: 'desktop'
    chromeMediaSourceId: string
  }
}

export enum RecordingType {
  GOOGLE_MEET = 'google_meet',
  LESSON = 'lesson',
  VIDEO = 'video'
}

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

export interface ElectronAPI {
  getDesktopSources: () => Promise<DesktopSource[]>
  saveVideo: (blob: Blob, filename: string) => Promise<SaveVideoResponse>
  processTranscript: (
    blob: Blob,
    filename: string,
    type: RecordingType
  ) => Promise<ProcessTranscriptResponse>
}

export type MessageType = 'success' | 'error' | 'loading' | 'info'

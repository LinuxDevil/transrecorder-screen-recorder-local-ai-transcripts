import { ElectronAPI } from '@electron-toolkit/preload'
import { RecordingType, SaveVideoResponse, ProcessTranscriptResponse, DesktopSource } from './types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    electronAPI: {
      getDesktopSources: () => Promise<DesktopSource[]>
      saveVideo: (videoBlob: Blob, filename: string) => Promise<SaveVideoResponse>
      processTranscript: (
        videoBlob: Blob,
        filename: string,
        recordingType: RecordingType
      ) => Promise<ProcessTranscriptResponse>
    }
  }
}

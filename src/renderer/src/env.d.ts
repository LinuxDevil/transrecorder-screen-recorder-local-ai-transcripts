/// <reference types="vite/client" />

declare global {
  interface Window {
    electronAPI: {
      getDesktopSources: () => Promise<DesktopSource[]>
      saveVideo: (blob: Blob, filename: string) => Promise<SaveVideoResponse>
      processTranscript: (
        blob: Blob,
        filename: string,
        type: RecordingType
      ) => Promise<ProcessTranscriptResponse>
    }
  }
}

export {}

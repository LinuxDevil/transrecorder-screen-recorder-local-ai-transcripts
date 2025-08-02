import { ipcRenderer } from 'electron'
import {
  SaveVideoResponse,
  ProcessTranscriptResponse,
  DesktopSource,
  RecordingType
} from '../types'

/**
 * Convert Blob to Buffer for IPC communication
 */
export async function blobToBuffer(blob: Blob): Promise<Buffer> {
  const arrayBuffer = await blob.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * Get desktop sources from main process
 */
export async function getDesktopSources(): Promise<DesktopSource[]> {
  const sources = await ipcRenderer.invoke('get-desktop-sources')
  return sources
}

/**
 * Save video file via main process
 */
export async function saveVideo(videoBlob: Blob, filename: string): Promise<SaveVideoResponse> {
  const buffer = await blobToBuffer(videoBlob)
  const result = await ipcRenderer.invoke('save-video', buffer, filename)
  return result
}

/**
 * Process transcript via main process
 */
export async function processTranscript(
  videoBlob: Blob,
  filename: string,
  recordingType: RecordingType
): Promise<ProcessTranscriptResponse> {
  const buffer = await blobToBuffer(videoBlob)
  const result = await ipcRenderer.invoke('process-transcript', buffer, filename, recordingType)
  return result
}

import { ipcMain, desktopCapturer } from 'electron'
import { SaveVideoResponse, ProcessTranscriptResponse } from '../types'
import {
  createStorageDirectories,
  generateFilePaths,
  saveVideoFile,
  saveTranscriptFile,
  saveSummaryFile
} from '../utils/file.utils'
import { extractTranscriptFromVideo } from '../utils/transcript.utils'
import { generateSummary } from '../utils/ollama.utils'

/**
 * Register all IPC handlers
 */
export function registerIpcHandlers(): void {
  ipcMain.handle('get-desktop-sources', async () => {
    const sources = await desktopCapturer.getSources({
      types: ['screen']
    })
    return sources
  })

  ipcMain.handle(
    'save-video',
    async (_, videoBlob: Buffer, filename: string): Promise<SaveVideoResponse> => {
      try {
        const { dateDir } = await createStorageDirectories()
        const { videoPath, transcriptPath } = generateFilePaths(dateDir, filename)

        await saveVideoFile(videoPath, videoBlob)
        await saveTranscriptFile(transcriptPath, '')

        return {
          success: true,
          videoPath,
          transcriptPath,
          message: 'Video saved successfully!'
        }
      } catch (error) {
        console.error('Error saving video:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Failed to save video'
        }
      }
    }
  )

  ipcMain.handle(
    'process-transcript',
    async (
      _,
      videoBlob: Buffer,
      filename: string,
      recordingType: string
    ): Promise<ProcessTranscriptResponse> => {
      try {
        const { dateDir } = await createStorageDirectories()
        const { videoPath, transcriptPath, summaryPath } = generateFilePaths(dateDir, filename)

        await saveVideoFile(videoPath, videoBlob)
        const transcript = await extractTranscriptFromVideo(videoPath)
        const summary = await generateSummary(transcript, recordingType)

        await saveTranscriptFile(transcriptPath, transcript)
        await saveSummaryFile(summaryPath, summary)

        return {
          success: true,
          transcript,
          summary,
          transcriptPath,
          summaryPath,
          message: 'Transcript and summary processed successfully!'
        }
      } catch (error) {
        console.error('Error processing transcript:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Failed to process transcript'
        }
      }
    }
  )
}

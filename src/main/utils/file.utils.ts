import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync, statSync } from 'fs'
import { app } from 'electron'
import { FilePaths } from '../types'

/**
 * Create the necessary directories for file storage
 */
export async function createStorageDirectories(): Promise<{
  desktopPath: string
  dateDir: string
}> {
  const desktopPath = join(app.getPath('desktop'), 'captured-videos')

  if (!existsSync(desktopPath)) {
    await mkdir(desktopPath, { recursive: true })
  }

  const now = new Date()
  const dateStr = now.toISOString().split('T')[0]
  const dateDir = join(desktopPath, dateStr)

  if (!existsSync(dateDir)) {
    await mkdir(dateDir, { recursive: true })
  }

  return { desktopPath, dateDir }
}

/**
 * Generate file paths for video, transcript, and summary
 */
export function generateFilePaths(dateDir: string, filename: string): FilePaths {
  const videoPath = join(dateDir, `${filename}.webm`)
  const transcriptPath = join(dateDir, `${filename}.txt`)
  const summaryPath = join(dateDir, `${filename}-summary.txt`)

  return {
    desktopPath: dateDir,
    dateDir,
    videoPath,
    transcriptPath,
    summaryPath
  }
}

/**
 * Save video file to disk
 */
export async function saveVideoFile(videoPath: string, videoBlob: Buffer): Promise<void> {
  await writeFile(videoPath, videoBlob)
}

/**
 * Save transcript file to disk
 */
export async function saveTranscriptFile(
  transcriptPath: string,
  transcript: string
): Promise<void> {
  await writeFile(transcriptPath, transcript)
}

/**
 * Save summary file to disk
 */
export async function saveSummaryFile(summaryPath: string, summary: string): Promise<void> {
  await writeFile(summaryPath, summary)
}

/**
 * Generate fallback transcript when Python script is not available
 */
export function generateFallbackTranscript(videoPath: string): string {
  const videoSize = statSync(videoPath).size
  const durationMinutes = Math.max(1, Math.round(videoSize / (2 * 1024 * 1024))) // 2MB per minute

  return `Fallback transcript for ${durationMinutes} minute video recording.

This is a fallback transcript since the Python audio extraction script is not available.
To enable real audio-to-text conversion:

1. Install Python dependencies: pip install -r requirements.txt
2. Install FFmpeg: https://ffmpeg.org/download.html
3. Ensure the audio_extractor.py script is in the project root

Video path: ${videoPath}
Video size: ${videoSize} bytes
Estimated duration: ${durationMinutes} minutes`
}

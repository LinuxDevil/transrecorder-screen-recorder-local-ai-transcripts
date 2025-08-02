import { join } from 'path'
import { existsSync } from 'fs'
import { spawn } from 'child_process'
import { PythonScriptResult } from '../types'
import { generateFallbackTranscript } from './file.utils'

/**
 * Extract transcript from video using Python script
 */
export async function extractTranscriptFromVideo(videoPath: string): Promise<string> {
  return new Promise((resolve) => {
    try {
      console.log('Running Python script to extract audio and transcribe...')

      const possiblePaths = [
        join(__dirname, '../../../audio_extractor.py'),
        join(process.cwd(), 'audio_extractor.py'),
        'audio_extractor.py'
      ]

      let scriptPath: string | null = null
      for (const path of possiblePaths) {
        if (existsSync(path)) {
          scriptPath = path
          break
        }
      }

      if (!scriptPath) {
        resolve(generateFallbackTranscript(videoPath))
        return
      }

      const pythonProcess = spawn('python', [scriptPath, videoPath])

      let stdout = ''
      let stderr = ''

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result: PythonScriptResult = JSON.parse(stdout)

            let transcript = result.whisper_transcript || result.google_transcript

            if (!transcript) {
              console.warn('No transcript generated, using fallback')
              transcript = generateFallbackTranscript(videoPath)
            }

            resolve(transcript)
          } catch (parseError) {
            console.error('Error parsing Python script output:', parseError)
            console.error('Raw stdout:', stdout)
            resolve(generateFallbackTranscript(videoPath))
          }
        } else {
          console.error('Python script failed with code:', code)
          console.error('Python stderr:', stderr)
          resolve(generateFallbackTranscript(videoPath))
        }
      })

      pythonProcess.on('error', (error) => {
        console.error('Error running Python script:', error)
        resolve(generateFallbackTranscript(videoPath))
      })
    } catch (error) {
      console.error('Error in extractTranscriptFromVideo:', error)
      resolve(generateFallbackTranscript(videoPath))
    }
  })
}

/**
 * Get appropriate prompt based on recording type
 */
export function getPromptForType(recordingType: string, transcript: string): string {
  if (recordingType === 'google_meet') {
    return `Please analyze this Google Meet transcript and provide:
1. A concise summary of the main topics discussed
2. Key decisions made
3. Action items and who they're assigned to
4. Important points or insights shared

Transcript:
${transcript}

Please format your response clearly with headers for each section.`
  } else if (recordingType === 'lesson') {
    return `Please analyze this lesson transcript and provide:
1. A summary of the main learning objectives
2. Key concepts and topics covered
3. Important definitions or explanations
4. Practical examples or demonstrations mentioned
5. Assignments or homework given

Transcript:
${transcript}

Please format your response clearly with headers for each section.`
  } else if (recordingType === 'video') {
    return `Please analyze this video transcript and provide:
1. A concise summary of the main content
2. Key points or highlights
3. Important information or insights
4. Any actionable items mentioned

Transcript:
${transcript}

Please format your response clearly with headers for each section.`
  } else {
    return `Please analyze this recording transcript and provide:
1. A concise summary of the main content
2. Key points or highlights
3. Important information or insights
4. Any actionable items mentioned

Transcript:
${transcript}

Please format your response clearly with headers for each section.`
  }
}

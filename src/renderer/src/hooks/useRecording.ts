import { useState, useRef, useEffect } from 'react'
import { RecordingType, DesktopCaptureConstraints } from '../types'
import {
  generateFilename,
  generateTranscriptFilename,
  getVideoMimeType
} from '../utils/recording.utils'

interface UseRecordingReturn {
  stream: MediaStream | null
  isRecording: boolean
  recordedVideo: string | null
  isSaving: boolean
  isProcessingTranscript: boolean
  saveMessage: string
  transcriptMessage: string
  recordingType: RecordingType
  hasVideo: boolean
  videoRef: React.RefObject<HTMLVideoElement | null>
  previewVideoRef: React.RefObject<HTMLVideoElement | null>
  setRecordingType: (type: RecordingType) => void
  startRecording: () => Promise<void>
  stopRecording: () => void
  downloadVideo: () => Promise<void>
  processTranscript: () => Promise<void>
}

export const useRecording = (): UseRecordingReturn => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isProcessingTranscript, setIsProcessingTranscript] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string>('')
  const [transcriptMessage, setTranscriptMessage] = useState<string>('')
  const [recordingType, setRecordingType] = useState<RecordingType>(RecordingType.VIDEO)
  const videoRef = useRef<HTMLVideoElement>(null)
  const chunksRef = useRef<Blob[]>([])
  const currentBlobRef = useRef<Blob | null>(null)
  const audioBlobRef = useRef<Blob | null>(null)
  const previewVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (previewVideoRef.current && stream) {
      previewVideoRef.current.srcObject = stream
    }
  }, [stream])

  const startRecording = async (): Promise<void> => {
    if (!window.electronAPI) {
      console.error('electronAPI is not available.')
      return
    }

    try {
      const sources = await window.electronAPI.getDesktopSources()
      if (!sources || sources.length === 0) {
        throw new Error('No desktop sources found')
      }

      const screenSource = sources[1]
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: screenSource.id
          }
        } as MediaTrackConstraints & DesktopCaptureConstraints,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: screenSource.id
          }
        } as MediaTrackConstraints & DesktopCaptureConstraints
      })
      setStream(mediaStream)

      const mimeType = getVideoMimeType()
      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: mimeType
      })

      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        currentBlobRef.current = blob
        audioBlobRef.current = blob

        if (recordedVideo) {
          URL.revokeObjectURL(recordedVideo)
        }

        const newBlobUrl = URL.createObjectURL(blob)
        setRecordedVideo(newBlobUrl)
        setIsRecording(false)

        const testVideo = document.createElement('video')
        testVideo.onerror = () => {
          console.error('Blob is not a valid video')
        }
        testVideo.src = newBlobUrl
      }

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event)
      }

      mediaRecorder.start(1000)
      setMediaRecorder(mediaRecorder)
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = (): void => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop()
      })
      setStream(null)
    }
  }

  const downloadVideo = async (): Promise<void> => {
    if (!currentBlobRef.current || !window.electronAPI) {
      console.error('No video blob available or electronAPI not available')
      return
    }

    setIsSaving(true)
    setSaveMessage('')

    try {
      const filename = generateFilename()
      const result = await window.electronAPI.saveVideo(currentBlobRef.current, filename)
      if (result.success) {
        setSaveMessage(
          `✅ ${result.message}\nVideo: ${result.videoPath}\nTranscript: ${result.transcriptPath}`
        )
      } else {
        setSaveMessage(`❌ ${result.message}: ${result.error}`)
      }
    } catch (error) {
      console.error('Error downloading video:', error)
      setSaveMessage(`❌ Failed to save video: ${error}`)
    } finally {
      setIsSaving(false)
    }
  }

  const processTranscript = async (): Promise<void> => {
    if (!currentBlobRef.current || !window.electronAPI) {
      setTranscriptMessage(
        '❌ No video available for transcript processing or electronAPI not available'
      )
      return
    }

    setIsProcessingTranscript(true)
    setTranscriptMessage('🔄 Processing transcript and generating summary...')

    try {
      const filename = generateTranscriptFilename()
      const result = await window.electronAPI.processTranscript(
        currentBlobRef.current,
        filename,
        recordingType
      )

      if (result.success) {
        setTranscriptMessage(`✅ Transcript and summary processed successfully!
📝 Transcript: ${result.transcript}
📋 Summary: ${result.summary}
📁 Files:
Transcript: ${result.transcriptPath}
Summary: ${result.summaryPath}`)
      } else {
        setTranscriptMessage(`❌ Failed to process transcript: ${result.error}`)
      }
    } catch (error) {
      setTranscriptMessage(
        `❌ Error processing transcript: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      setIsProcessingTranscript(false)
    }
  }

  return {
    stream,
    isRecording,
    recordedVideo,
    isSaving,
    isProcessingTranscript,
    saveMessage,
    transcriptMessage,
    recordingType,
    hasVideo: !!currentBlobRef.current,
    videoRef,
    previewVideoRef,
    setRecordingType,
    startRecording,
    stopRecording,
    downloadVideo,
    processTranscript
  }
}

import React from 'react'
import { VideoIcon, MonitorIcon } from '../icons'

interface VideoPreviewProps {
  stream: MediaStream | null
  recordedVideo: string | null
  previewVideoRef: React.RefObject<HTMLVideoElement | null>
  videoRef: React.RefObject<HTMLVideoElement | null>
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  stream,
  recordedVideo,
  previewVideoRef,
  videoRef
}) => {
  return (
    <div className="video-grid">
      <div className="video-card">
        <div className="video-card-header">
          <div className="video-card-title">
            <MonitorIcon />
            <h2 className="video-card-heading">Live Preview</h2>
          </div>
          <p className="video-card-description">Real-time preview of your screen recording</p>
        </div>
        <div className="video-card-content">
          <div className="video-container">
            <video ref={previewVideoRef} autoPlay muted className="video-element" />
            {!stream && (
              <div className="video-placeholder">
                <div className="video-placeholder-content">
                  <div className="video-placeholder-icon">
                    <MonitorIcon />
                  </div>
                  <p className="video-placeholder-text">Preview will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="video-card">
        <div className="video-card-header">
          <div className="video-card-title">
            <VideoIcon />
            <h2 className="video-card-heading">Recorded Video</h2>
          </div>
          <p className="video-card-description">Playback of your completed recording</p>
        </div>
        <div className="video-card-content">
          <div className="video-container">
            {recordedVideo ? (
              <video
                ref={videoRef}
                controls
                className="video-element-recorded"
                src={recordedVideo}
              />
            ) : (
              <div className="video-empty">
                <div className="video-empty-content">
                  <div className="video-empty-icon">
                    <VideoIcon />
                  </div>
                  <p className="video-empty-text">No recording available</p>
                  <p className="video-empty-subtext">Start recording to see your video here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { DesktopSource } from '../types'
import { getButtonClasses } from '../utils/ui.utils'
import { MonitorIcon, RefreshIcon } from './icons'

interface ScreenSelectorProps {
  availableScreens: DesktopSource[]
  selectedScreen: DesktopSource | null
  onScreenSelect: (screen: DesktopSource | null) => void
  onRefreshScreens: () => Promise<void>
  isLoading?: boolean
}

export const ScreenSelector: React.FC<ScreenSelectorProps> = ({
  availableScreens,
  selectedScreen,
  onScreenSelect,
  onRefreshScreens,
  isLoading = false
}): React.JSX.Element => {
  const [previewStreams, setPreviewStreams] = useState<Record<string, MediaStream | null>>({})
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

  useEffect(() => {
    let isMounted = true
    const getPreviewStream = async (sourceId: string): Promise<MediaStream | null> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sourceId,
              maxWidth: 320,
              maxHeight: 180
            }
          } as MediaTrackConstraints
        })
        return stream
      } catch {
        return null
      }
    }
    ;(async () => {
      const streams: Record<string, MediaStream | null> = {}
      for (const screen of availableScreens) {
        streams[screen.id] = await getPreviewStream(screen.id)
      }
      if (isMounted) setPreviewStreams(streams)
    })()
    return () => {
      isMounted = false
      Object.values(previewStreams).forEach((stream) => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
      })
      setPreviewStreams({})
    }
  }, [availableScreens])

  useEffect(() => {
    for (const [id, stream] of Object.entries(previewStreams)) {
      const video = videoRefs.current[id]
      if (video && stream) {
        video.srcObject = stream
      }
    }
  }, [previewStreams])

  return (
    <div className="screen-selector-card">
      <div className="screen-selector-header">
        <div className="screen-selector-title">
          <div className="screen-selector-icon">
            <MonitorIcon />
          </div>
          <h3 className="screen-selector-heading">Screen Selection</h3>
        </div>
        <button
          onClick={onRefreshScreens}
          disabled={isLoading}
          className={getButtonClasses('secondary', isLoading)}
          title="Refresh available screens"
        >
          <RefreshIcon />
          <span className="btn-icon">Refresh</span>
        </button>
      </div>
      <div className="screen-selector-content">
        {availableScreens.length === 0 ? (
          <div className="screen-selector-empty">
            <p className="screen-selector-empty-text">
              No screens available. Click &quot;Refresh&quot; to detect available screens.
            </p>
          </div>
        ) : (
          <div className="screen-selector-list">
            {availableScreens.map((screen) => (
              <label key={screen.id} className="screen-selector-option">
                <input
                  type="radio"
                  name="screenSelection"
                  value={screen.id}
                  checked={selectedScreen?.id === screen.id}
                  onChange={() => onScreenSelect(screen)}
                  className="screen-selector-radio"
                />
                <div className="screen-selector-option-content">
                  <div className="screen-selector-option-info">
                    <span className="screen-selector-option-name">{screen.name}</span>
                    <span className="screen-selector-option-id">ID: {screen.display_id}</span>
                  </div>
                  <div className="screen-selector-thumbnail">
                    <video
                      ref={(el) => {
                        videoRefs.current[screen.id] = el
                      }}
                      className="screen-selector-thumbnail-img"
                      autoPlay
                      muted
                      playsInline
                      width={160}
                      height={90}
                      style={{ background: '#222', borderRadius: 6, objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

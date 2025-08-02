import React from 'react'
import { DesktopSource } from '../../types'
import { getButtonClasses } from '../../utils/ui.utils'
import { MonitorIcon, RefreshIcon } from '../icons'

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
                    <div className="screen-selector-thumbnail-placeholder">
                      <MonitorIcon />
                    </div>
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

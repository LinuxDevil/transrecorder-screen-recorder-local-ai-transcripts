import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { getDesktopSources, saveVideo, processTranscript } from './api.utils'
import { ElectronAPI } from '../types'

/**
 * Expose APIs to renderer process with context isolation
 */
export function exposeAPIsWithContextIsolation(): void {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', {})

    contextBridge.exposeInMainWorld('electronAPI', {
      getDesktopSources,
      saveVideo,
      processTranscript
    } as ElectronAPI)
  } catch (error) {
    console.error('Error exposing APIs:', error)
  }
}

/**
 * Expose APIs to renderer process without context isolation (fallback)
 */
export function exposeAPIsWithoutContextIsolation(): void {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = {}
}

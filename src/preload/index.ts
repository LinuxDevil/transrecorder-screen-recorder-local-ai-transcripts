import {
  exposeAPIsWithContextIsolation,
  exposeAPIsWithoutContextIsolation
} from './utils/bridge.utils'

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  exposeAPIsWithContextIsolation()
} else {
  exposeAPIsWithoutContextIsolation()
}

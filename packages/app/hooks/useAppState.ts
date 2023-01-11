import { useEffect } from 'react'
import { AppState as NativeAppState } from 'react-native'

interface AppStateType extends NativeAppState {
  removeEventListener: NativeAppState['addEventListener']
}

const AppState = NativeAppState as AppStateType

type AppStateStatus = Parameters<Parameters<typeof AppState.addEventListener>[1]>[0]

export function useAppState(onChange: (state: AppStateStatus) => void) {
  useEffect(() => {
    if (AppState) AppState.addEventListener('change', onChange)
    return () => {
      if (AppState) AppState.removeEventListener('change', onChange)
    }
  }, [onChange])
}

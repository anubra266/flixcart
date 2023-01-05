import 'expo-dev-client'
import React from 'react'
import { useFonts } from 'expo-font'
import { useOnlineManager } from 'app/hooks/useOnlineManager'
import { useAppState } from 'app/hooks/useAppState'
import { NativeNavigation } from 'app/navigation/native'
import { Provider } from 'app/provider'
import { Platform } from 'react-native'
import { QueryClient, QueryClientProvider, focusManager } from 'react-query'
import { StatusBar } from 'expo-status-bar'

function onAppStateChange(status) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
})

export default function App() {
  useOnlineManager()

  useAppState(onAppStateChange)

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider defaultTheme="dark">
        <NativeNavigation />
      </Provider>
      <StatusBar />
    </QueryClientProvider>
  )
}

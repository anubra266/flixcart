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
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { HoldMenuProvider } from 'react-native-hold-menu'
import FeatherIcon from 'react-native-vector-icons/Feather'

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
        <HoldMenuProvider theme="dark" iconComponent={FeatherIcon}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <NativeNavigation />
          </GestureHandlerRootView>
        </HoldMenuProvider>
      </Provider>
      <StatusBar />
    </QueryClientProvider>
  )
}

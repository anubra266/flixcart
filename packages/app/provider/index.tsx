import config from '../tamagui.config'
import { NavigationProvider } from './navigation'
import { TamaguiProvider, TamaguiProviderProps } from '@my/ui'
import { FlixcartProvider } from 'app/context'
import { useStore } from 'app/context/useStore'

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const store = useStore()
  return (
    <FlixcartProvider {...store}>
      <TamaguiProvider config={config} disableInjectCSS defaultTheme="light" {...rest}>
        <NavigationProvider>{children}</NavigationProvider>
      </TamaguiProvider>
    </FlixcartProvider>
  )
}

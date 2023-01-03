import { Stack } from 'tamagui'
import { StackProps } from '@tamagui/core'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const SafeAreaStack = (props: StackProps) => {
  const insets = useSafeAreaInsets()

  return (
    <Stack
      backgroundColor="$backgroundStrong"
      paddingTop={Math.max(insets.top, 16)}
      paddingBottom={Math.max(insets.bottom, 16)}
      {...props}
    />
  )
}

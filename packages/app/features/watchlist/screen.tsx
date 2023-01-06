import { Button, H1, Paragraph, Separator, XStack, YStack, Stack, SafeAreaStack } from '@my/ui'
import { AlignLeft, Plus } from '@tamagui/lucide-icons'
import React from 'react'

import { WatchListItem } from 'app/components/WatchListItem'
import { HoldItem } from 'react-native-hold-menu'

import { useStore } from 'app/hooks/useStore'
import { useLink } from 'solito/link'
import { useRouter } from 'solito/router'
import { ItemType } from 'app/helpers/constants'
import * as Haptics from 'expo-haptics'
import { useNotification } from 'app/hooks/useNotification'

export function WatchListScreen() {
  const { watchlist, removeItemFromWatchList } = useStore()

  const searchLinkProps = useLink({
    href: `/search`,
  })

  const { push } = useRouter()

  // So the apps asks for permissions when the user first opens the app
  useNotification()

  const MenuItems = [
    {
      text: 'View',
      icon: 'eye',
      onPress: (itemId: string, itemType: ItemType) => {
        push(`/detail/${itemType.toLocaleLowerCase()}/${itemId}`)
      },
    },
    {
      text: 'Remove',
      icon: 'trash',
      isDestructive: true,
      onPress: (itemId: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        removeItemFromWatchList(itemId)
      },
    },
  ]

  return (
    <SafeAreaStack f={1}>
      <Stack f={1} p="$4">
        <XStack alignItems="center" jc="space-between">
          <XStack />
          {/* <Button padding={0} chromeless icon={<AlignLeft size={24} />} /> */}
          <Button themeInverse size="$2" icon={<Plus size={18} />} circular {...searchLinkProps} />
        </XStack>
        {!!watchlist.length && (
          <YStack f={1} width="100%" space="$1">
            {watchlist.map((item) => (
              <HoldItem
                menuAnchorPosition="top-left"
                hapticFeedback="Heavy"
                items={MenuItems}
                key={item.id}
                actionParams={{
                  View: [item.id, item.type],
                  Remove: [item.id],
                }}
              >
                <WatchListItem
                  paddingVertical="$2"
                  height={120}
                  backgroundColor="$backgroundStrong"
                  item={item}
                  pressStyle={{ scale: 1.2 }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    push(`/detail/${item.type.toLocaleLowerCase()}/${item.id}`)
                  }}
                  hoverStyle={undefined}
                />
              </HoldItem>
            ))}
          </YStack>
        )}
        {!watchlist.length && (
          <YStack f={1} jc="center" ai="center" p="$4" space>
            <YStack space="$4" maw={600}>
              <H1 ta="center">flixcart</H1>
              <Paragraph ta="center">
                You don't currently have any items on your watchlist.
              </Paragraph>
              <Separator />
              <Paragraph ta="center">Click the + icon to add a new one </Paragraph>
            </YStack>
          </YStack>
        )}
      </Stack>
    </SafeAreaStack>
  )
}

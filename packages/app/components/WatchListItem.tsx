import {
  Text,
  Sheet,
  XStack,
  YStack,
  Stack,
  Card,
  Image,
  CardProps,
  Button,
  Paragraph,
} from '@my/ui'
import { DEFAULT_IMAGE } from 'app/helpers/constants'
import React, { useState } from 'react'
import { BookmarkPlus, X, Star } from '@tamagui/lucide-icons'
import * as Haptics from 'expo-haptics'
import { WatchListItem as IWatchListItem } from 'app/helpers/types'
import {} from 'solito'
import { useNotificationResponse } from 'app/hooks/useNotification'
import { useFlixcartContext } from 'app/context'

interface WatchListItemProps extends CardProps {
  item: IWatchListItem
  search?: boolean
}

export function WatchListItem(props: WatchListItemProps) {
  const { item, search, ...rest } = props

  const { getItemInWatchList, addItemToWatchList, removeItemFromWatchList } =
    useFlixcartContext('flixcart')

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  const itemInWatchList = getItemInWatchList(item)

  useNotificationResponse({
    callback() {
      setOpen(false)
    },
  })

  return (
    <>
      <Card
        elevate
        animation="bouncy"
        height={100}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.925 }}
        backgroundColor="$backgroundTransparent"
        onPress={() => setOpen(true)}
        {...rest}
      >
        <XStack flex={1} space="$4">
          <Image borderRadius={8} src={item.image || DEFAULT_IMAGE} height="100%" width={100} />
          <YStack paddingVertical="$2" space="$2" f={1} width="auto">
            <XStack ai="center">
              <Text fontWeight="600" fontSize={16} color="white" marginRight="$4">
                {item.name}
              </Text>
              {search && itemInWatchList && (
                <Stack ml="auto">
                  <Star size={16} color="gold" />
                </Stack>
              )}
            </XStack>
            <Text color="gray" fontSize={14}>
              {item.language} <Text textTransform="capitalize">{item.type}</Text>
            </Text>
            <XStack marginTop="auto" space="$2">
              {item.genres?.map((genre) => (
                <Stack padding={4} key={genre} backgroundColor="$backgroundSoft" borderRadius="$2">
                  <Text color="white" fontSize={10}>
                    {genre}
                  </Text>
                </Stack>
              ))}
            </XStack>
          </YStack>
        </XStack>
      </Card>
      {/*  */}

      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[95]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame backgroundColor="$backgroundStrong" p="$4">
          <Sheet.Handle />
          <Stack position="relative">
            <Button
              backgroundColor="rgba(0,0,0,0.7)"
              icon={<X size={20} />}
              circular
              position="absolute"
              top={10}
              left={10}
              zi={2}
              onPress={() => setOpen(false)}
            />
            <Image borderRadius={8} src={item.image || DEFAULT_IMAGE} height={600} width="100%" />
          </Stack>
          <Stack
            width="100%"
            // backgroundColor="rgba(0,0,0,0.9)"
            padding="$4"
            space="$2"
          >
            <Text
              ta="center"
              fontSize={20}
              fontWeight="600"
              textTransform="uppercase"
              color="white"
            >
              {item.name}
            </Text>
            <XStack justifyContent="center" alignItems="center" space="$4">
              <Button
                disabled={itemInWatchList}
                circular={!itemInWatchList}
                opacity={itemInWatchList ? 0.7 : 1}
                icon={<BookmarkPlus size={24} />}
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                  addItemToWatchList(item)
                }}
              >
                {itemInWatchList && 'Added'}
              </Button>

              {itemInWatchList && (
                <Button
                  theme="red_Button"
                  circular
                  icon={<X size={24} />}
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                    removeItemFromWatchList(item.id)
                  }}
                />
              )}
            </XStack>
          </Stack>

          <Stack space="$4" marginTop="$1">
            <Text ta="center" color="white" fontWeight="700" fontSize={16}>
              {item.genres?.map((genre, i, arr) => `${genre}${i !== arr.length - 1 ? ', ' : ''}`)}
            </Text>
            <Paragraph
              paddingHorizontal="$5"
              numberOfLines={3}
              ta="center"
              fontSize={12}
              lineHeight={16}
              color="gray"
            >
              {item.summary?.replace(/(<([^>]+)>)/gi, '')}
            </Paragraph>
          </Stack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

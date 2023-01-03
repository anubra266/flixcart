import {
  Anchor,
  Button,
  H1,
  Text,
  Paragraph,
  Separator,
  Sheet,
  XStack,
  YStack,
  Stack,
  Input,
  SafeAreaStack,
} from '@my/ui'
import { AlignLeft, Search, Plus } from '@tamagui/lucide-icons'
import React, { useState } from 'react'
import { useLink } from 'solito/link'

export function WatchListScreen() {
  const linkProps = useLink({
    href: '/user/nate',
  })

  return (
    <SafeAreaStack f={1}>
      <Stack f={1} p="$4">
        <XStack alignItems="center" jc="space-between">
          <Button chromeless icon={<AlignLeft size={24} />} />
          <NewItem />
        </XStack>
        <YStack f={1} jc="center" ai="center" p="$4" space>
          <YStack space="$4" maw={600}>
            <H1 ta="center">flixcart</H1>
            <Paragraph ta="center">You don't currently have any items on your watchlist.</Paragraph>
            <Separator />
            <Paragraph ta="center">Click the + icon to add a new one </Paragraph>
          </YStack>
        </YStack>
      </Stack>
    </SafeAreaStack>
  )
}

function NewItem() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  return (
    <>
      <Button
        themeInverse
        size="$2"
        icon={<Plus size={18} />}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame backgroundColor="$background" p="$4">
          <Sheet.Handle />
          <XStack ai="center" space="$2" width="100%">
            <Input
              autoFocus={false}
              size="$4"
              flex={1}
              borderWidth={1}
              placeholder="Search TV Show or Movie Title"
            />
            <Button size="$4" icon={<Search size={18} />} />
          </XStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

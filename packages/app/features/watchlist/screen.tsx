import {
  Button,
  H1,
  Paragraph,
  Separator,
  Sheet,
  XStack,
  YStack,
  Stack,
  Input,
  SafeAreaStack,
  useDebounceValue,
  ScrollView,
} from '@my/ui'
import { AlignLeft, Search, Plus } from '@tamagui/lucide-icons'
import React, { useState } from 'react'

import { useQuery } from 'react-query'
import { fetchShows } from 'app/api/fetchShows'
import { useRefreshOnFocus } from 'app/hooks/useRefreshOnFocus'
import { WatchListItem } from 'app/components/WatchListItem'
import { fetchMovies } from 'app/api/fetchMovies'

import { useStore } from 'app/hooks/useStore'
import { useLink } from 'solito/link'

export function WatchListScreen() {
  const { watchlist } = useStore()

  const searchLinkProps = useLink({
    href: `/search`,
  })

  return (
    <SafeAreaStack f={1}>
      <Stack f={1} p="$4">
        <XStack alignItems="center" jc="space-between">
          <Button padding={0} chromeless icon={<AlignLeft size={24} />} />
          <Button themeInverse size="$2" icon={<Plus size={18} />} circular {...searchLinkProps} />
        </XStack>
        {!!watchlist.length && (
          <YStack f={1} width="100%" space="$4">
            {watchlist.map((item) => (
              <WatchListItem
                item={item}
                key={item.id}
                onPress={() => {}}
                animation={undefined}
                hoverStyle={undefined}
                pressStyle={undefined}
              />
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

import { Button, Input, useDebounceValue, ScrollView, XStack, YStack, Text, H2 } from '@my/ui'
import { SafeAreaStack } from '@my/ui/src'
import { ChevronLeft, Search } from '@tamagui/lucide-icons'
import { useQuery } from 'react-query'
import { fetchShows } from 'app/api/fetchShows'
import { useRefreshOnFocus } from 'app/hooks/useRefreshOnFocus'
import { WatchListItem } from 'app/components/WatchListItem'
import { fetchMovies } from 'app/api/fetchMovies'
import React, { useState } from 'react'
import { createParam } from 'solito'
import { useLink } from 'solito/link'

const { useParam } = createParam<{ id: string }>()

export function SearchScreen() {
  const linkProps = useLink({ href: '/' })

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounceValue(query, 500)

  const { isLoading, error, data, refetch } = useQuery(
    ['shows', debouncedQuery],
    () => fetchShows(debouncedQuery),
    { enabled: Boolean(debouncedQuery) }
  )

  const {
    isLoading: isLoadingMovies,
    data: moviesData,
    refetch: refetchMovies,
  } = useQuery(['movies', debouncedQuery], () => fetchMovies(debouncedQuery), {
    enabled: Boolean(debouncedQuery),
  })

  useRefreshOnFocus(refetch, debouncedQuery)
  useRefreshOnFocus(refetchMovies, debouncedQuery)

  return (
    <>
      <SafeAreaStack f={1} paddingHorizontal="$4">
        <XStack ai="center" space="$4">
          <Button
            size="$2"
            padding={0}
            chromeless
            icon={<ChevronLeft color="royalblue" size={24} />}
            {...linkProps}
          />
          <H2>Search</H2>
        </XStack>
        <XStack ai="center" space="$2" width="100%" marginTop="$2">
          <Input
            autoFocus={false}
            size="$4"
            flex={1}
            borderWidth={1}
            placeholder="Search TV Show or Movie Title"
            onChangeText={(value) => setQuery(value)}
            selectTextOnFocus
          />
          <Button size="$2" chromeless icon={<Search size={18} />} />
        </XStack>
        <ScrollView>
          <YStack space="$4" marginTop="$4">
            {data?.map((show) => {
              return <WatchListItem search item={show} key={show.id} />
            })}
            {moviesData?.map((movie) => {
              return <WatchListItem search item={movie} key={movie.id} />
            })}
          </YStack>
        </ScrollView>
      </SafeAreaStack>
      {/* <YStack f={1} jc="center" ai="center" space>
        <Paragraph ta="center" fow="800">{`User ID: ${id}`}</Paragraph>
        <Button {...linkProps} icon={ChevronLeft}>
          Go Home
        </Button>
      </YStack> */}
    </>
  )
}

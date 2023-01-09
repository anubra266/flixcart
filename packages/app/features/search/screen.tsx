import {
  Button,
  Input,
  useDebounceValue,
  ScrollView,
  XStack,
  YStack,
  Text,
  H2,
  Card,
  Circle,
} from '@my/ui'
import { SafeAreaStack } from '@my/ui/src'
import { ChevronLeft, Search } from '@tamagui/lucide-icons'
import { useQuery } from 'react-query'
import { fetchShows } from 'app/api/fetchShows'
import { useRefreshOnFocus } from 'app/hooks/useRefreshOnFocus'
import { WatchListItem } from 'app/components/WatchListItem'
import { fetchMovies } from 'app/api/fetchMovies'
import { useState, useEffect } from 'react'
import { useLink } from 'solito/link'
import NetInfo from '@react-native-community/netinfo'

export function SearchScreen() {
  const linkProps = useLink({ href: '/' })

  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnline(state.isConnected)
    })

    return () => unsubscribe()
  }, [])

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
            icon={<ChevronLeft color="gold" size={24} />}
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
        {!online && (
          <Card mt="$4" p="$4" theme="red_Card" backgroundColor="$red6Dark" elevate bordered>
            <XStack ai="center" space="$3">
              <Circle size={14} backgroundColor="$red9Dark" />
              <Text color="$color">Device is offline</Text>
            </XStack>
          </Card>
        )}
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
    </>
  )
}

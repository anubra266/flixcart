import { WatchListItem } from 'app/helpers/types'
import { useLink } from 'solito/link'

import { Button, Paragraph, YStack, Text, Image, XStack } from '@my/ui'
import { Check, ChevronLeft, X } from '@tamagui/lucide-icons'

import * as Haptics from 'expo-haptics'
import { DEFAULT_IMAGE } from 'app/helpers/constants'
import { toHoursAndMinutes, transformDate } from 'app/helpers/date'
import { useRouter } from 'solito/router'
import { useFlixcartContext } from 'app/context'

type MovieDetailProps = {
  item: WatchListItem
}
export function MovieDetail(props: MovieDetailProps) {
  const { item } = props

  const backLinkProps = useLink({ href: '/' })

  const { removeItemFromWatchList, toggleEpisodeStatus } = useFlixcartContext('flixcart')

  const movie = item.episodes[0]

  const [airPeriod, airDate] = transformDate(movie?.airDate!, item.type)

  const runTime = toHoursAndMinutes(movie?.runtime!)

  const { push } = useRouter()

  return (
    <YStack padding="$4">
      <YStack position="relative">
        <Button
          backgroundColor="rgba(0,0,0,0.7)"
          icon={<ChevronLeft size={20} />}
          circular
          position="absolute"
          top={10}
          left={10}
          zi={2}
          {...backLinkProps}
          onPress={(e) => {
            backLinkProps.onPress(e)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }}
        />
        <Image borderRadius={8} src={item.image || DEFAULT_IMAGE} height={500} width="100%" />
      </YStack>
      <YStack width="100%" padding="$4" space="$2">
        <Text ta="center" fontSize={20} fontWeight="600" textTransform="uppercase" color="white">
          {item.name}
        </Text>
      </YStack>

      <YStack space="$4" marginTop="$1">
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
        <Text ta="center" color="white" fontSize={16}>
          <Text fontWeight="600">{movie?.status ?? airPeriod}</Text> {airDate}
        </Text>
        <Text ta="center" color="white" fontSize={16}>
          <Text fontWeight="600"> Runtime </Text> {runTime}
        </Text>
        <XStack jc="center" space="$3">
          <Button
            theme={movie?.watched ? 'gray_Button' : 'green_Button'}
            icon={movie?.watched ? <X size={24} /> : <Check size={24} />}
            onPress={() => {
              Haptics.notificationAsync(
                movie?.watched
                  ? Haptics.NotificationFeedbackType.Warning
                  : Haptics.NotificationFeedbackType.Success
              )
              toggleEpisodeStatus(item.id, movie?.id!)
            }}
          >
            Mark {movie?.watched ? 'Unwatched' : 'Watched'}
          </Button>
          <Button
            theme="red_Button"
            icon={<X size={24} />}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
              removeItemFromWatchList(item.id)
              push('/')
            }}
          >
            Remove
          </Button>
        </XStack>
      </YStack>
    </YStack>
  )
}

import { YStack, XStack, Circle, Text } from '@my/ui'
import { Check } from '@tamagui/lucide-icons'
import { EpisodeDetail } from 'app/features/item/episode-detail'

import { ShowEpisode, WatchListItem } from 'app/helpers/types'
import { setSeasonStatus } from 'app/store/actions'

import * as Haptics from 'expo-haptics'

type SeasonDetailProps = {
  seasonGroup: [string, ShowEpisode[]]
  show: WatchListItem
}

export function SeasonDetail(props: SeasonDetailProps) {
  const { seasonGroup, show } = props

  const [season, episodes] = seasonGroup

  const isWatched = episodes.every((episode) => episode.watched)

  const toggleSeasonWatched = () => {
    Haptics.notificationAsync(
      isWatched
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Success
    )
    setSeasonStatus(show.id, season, !isWatched)
  }

  return (
    <YStack key={`Season-${season}`} space>
      <XStack ai="center" marginVertical="$4">
        <Text color="white" fontWeight="600" fontSize={24}>
          Season {season}
        </Text>

        <Circle
          ml="auto"
          size="$5"
          borderColor="white"
          borderWidth="$1.5"
          onPress={toggleSeasonWatched}
        >
          {isWatched && <Check color="white" />}
        </Circle>
      </XStack>
      <YStack key={`Season-${season}`} space>
        {episodes.map((episode) => (
          <EpisodeDetail showId={show.id} item={episode} key={episode.id} />
        ))}
      </YStack>
    </YStack>
  )
}

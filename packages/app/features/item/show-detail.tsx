import { YStack, XStack, H2, Separator, Button, ScrollView } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { SeasonDetail } from 'app/features/item/season-detail'

import { ShowEpisode, WatchListItem } from 'app/helpers/types'
import { groupBy } from 'app/helpers/utils'
import { useLink } from 'solito/link'

type ShowDetailProps = {
  item: WatchListItem
}

export function ShowDetail(props: ShowDetailProps) {
  const { item } = props

  const episodes = item.episodes

  const seasons = groupBy(episodes, (episode) => episode.season)

  const homeLinkProps = useLink({ href: '/' })

  const seasonGroups = Object.entries<ShowEpisode[]>(seasons).sort(
    (a, b) => parseInt(b[0]) - parseInt(a[0])
  )

  return (
    <YStack>
      <XStack ai="center" space="$4" paddingHorizontal="$4">
        <Button
          size="$2"
          padding={0}
          chromeless
          icon={<ChevronLeft color="gold" size={24} />}
          {...homeLinkProps}
        />
        <H2 color="gold" letterSpacing={1}>
          {item.name}
        </H2>
      </XStack>
      <Separator />
      <ScrollView space="$6" padding="$4"  >
        <YStack f={1} paddingBottom={100}>
          {seasonGroups.map((seasonGroup) => (
            <SeasonDetail key={seasonGroup[0]} seasonGroup={seasonGroup} show={item} />
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  )
}

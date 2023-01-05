import { YStack, XStack, Circle, Image, Sheet, Button, Text, Paragraph } from '@my/ui'
import { Check, ChevronLeft, X } from '@tamagui/lucide-icons'
import { DEFAULT_IMAGE, ItemType } from 'app/helpers/constants'
import { ShowEpisode } from 'app/helpers/types'
import { useState } from 'react'
import * as Haptics from 'expo-haptics'
import { toHoursAndMinutes, transformDate } from 'app/helpers/date'
import { useStore } from 'app/hooks/useStore'

type EpisodeDetailProps = {
  item: ShowEpisode
  showId: string
}

export function EpisodeDetail(props: EpisodeDetailProps) {
  const { item, showId } = props

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  const [airPeriod, airDate] = transformDate(item?.airDate!, ItemType.SHOW)

  const runTime = toHoursAndMinutes(item?.runtime!)

  const { toggleEpisodeStatus } = useStore()

  const toggleWatched = () => {
    toggleEpisodeStatus(showId, item?.id!)
    Haptics.notificationAsync(
      item?.watched
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Success
    )
  }

  return (
    <>
      <XStack
        onPress={() => {
          setOpen(true)
        }}
        ai="center"
        space="$3"
        animation="bouncy"
        pressStyle={{ scale: 1.05 }}
      >
        <Image height={100} width={100} src={item.image || DEFAULT_IMAGE} borderRadius={8} />
        <YStack f={1} space="$2.5">
          <Text color="white" fontWeight="500" fontSize={18} letterSpacing={1}>
            {item.name}
          </Text>
          <Text color="white">
            {airPeriod} {airDate}
          </Text>
          <Paragraph numberOfLines={2} fontSize={12} lineHeight={16} color="gray">
            {item.summary?.replace(/(<([^>]+)>)/gi, '')}
          </Paragraph>
        </YStack>
        <Circle size="$5" borderColor="gold" borderWidth="$1.5" onPress={toggleWatched}>
          {item.watched && <Check color="gold" />}
        </Circle>
      </XStack>

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
        <Sheet.Frame backgroundColor="$backgroundStrong">
          <Sheet.Handle mt="$4" />

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
                onPress={(e) => {
                  setOpen(false)
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }}
              />
              <Image borderRadius={8} src={item.image || DEFAULT_IMAGE} height={350} width="100%" />
            </YStack>
            <YStack width="100%" padding="$4" space="$2">
              <Text
                ta="center"
                fontSize={20}
                fontWeight="600"
                textTransform="uppercase"
                color="white"
              >
                {item.name}
              </Text>
            </YStack>

            <YStack space="$4" marginTop="$1">
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
                <Text fontWeight="600">{airPeriod}</Text> {airDate}
              </Text>
              <Text ta="center" color="white" fontSize={16}>
                <Text fontWeight="600"> Runtime </Text> {runTime}
              </Text>
              <XStack jc="center" space="$3">
                <Button
                  theme={item?.watched ? 'gray_Button' : 'green_Button'}
                  icon={item?.watched ? <X size={24} /> : <Check size={24} />}
                  onPress={toggleWatched}
                >
                  Mark {item?.watched ? 'Unwatched' : 'Watched'}
                </Button>
              </XStack>
            </YStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

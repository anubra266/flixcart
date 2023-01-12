import { useEffect, useRef } from 'react'

import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import { ShowEpisode, WatchListItem } from 'app/helpers/types'
import { ItemType } from 'app/helpers/constants'
import { useRouter } from 'solito/router'
import { useFlixcartContext } from 'app/context'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export const useNotificationResponse = ({
  callback,
}: {
  callback: (response: Notifications.NotificationResponse) => void
}) => {
  const responseListener = useRef<any>()

  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      callback(response)
    })

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])
}

const actions = ['markWatched'] as const
type Action = typeof actions[number]

export const useNotification = () => {
  const { push } = useRouter()

  const { setEpisodeStatus } = useFlixcartContext('flixcart')

  useNotificationResponse({
    callback(response) {
      const url = response.notification.request.content.data.url as string
      const identifier = response.actionIdentifier as Action
      if (!actions.includes(identifier)) {
        push(url)
      }
    },
  })

  useEffect(() => {
    registerForPushNotificationsAsync()

    const subscription = Notifications.addNotificationResponseReceivedListener(async (response) => {
      const identifier = response.actionIdentifier as Action

      if (identifier === 'markWatched') {
        const notificationData = response.notification.request.content.data as Record<string, any>
        setEpisodeStatus(notificationData.itemId, notificationData.episodeId, true)
      }
      await Notifications.dismissNotificationAsync(response.notification.request.identifier)
    })
    return () => subscription.remove()
  }, [])
}

const getEpisodeTime = (episode: ShowEpisode) => {
  if (!episode.airDate) return
  const episodeDate = new Date(episode.airDate)
  //? Send notifications at 6am of release day - comment out when testing to allow exact time
  episodeDate.setHours(6, 0, 0, 0)
  const time = (episodeDate.getTime() - Date.now()) / 1000
  return time
}

const getNotificationDetails = (item: WatchListItem, episode: ShowEpisode) => {
  const title = item.type === ItemType.MOVIE ? 'Movie Release' : 'TV Show New Episode'
  const body =
    item.type === ItemType.MOVIE
      ? `${item.name} premiers today!`
      : `${item.name} Season ${episode.season} ${episode.name} airs today!`

  const time = getEpisodeTime(episode)

  return { title, body, time }
}

export async function schedulePushNotification(item: WatchListItem, episode: ShowEpisode) {
  const { title, body, time } = getNotificationDetails(item, episode)

  if (!time) return null

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: {
        url: `/detail/${item.type.toLocaleLowerCase()}/${item.id}`,
        itemId: item.id,
        episodeId: episode.id,
      },
      categoryIdentifier: 'reminder',
    },
    trigger: { seconds: time },
  })

  const actions = [
    {
      identifier: 'markWatched',
      buttonTitle: 'Mark as watched',
      options: {
        // isAuthenticationRequired?: boolean,
        opensAppToForeground: false,
      },
    },
  ]

  await Notifications.setNotificationCategoryAsync('reminder', actions)

  return id
}

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
  } else {
    alert('Must use physical device for Push Notifications')
  }
}

export async function cancelNotification(notifId: string) {
  await Notifications.cancelScheduledNotificationAsync(notifId)
}

export const scheduleEpisodetNotifications = async (item: WatchListItem) => {
  const episodes = await Promise.all(
    item.episodes.map(async (episode) => {
      const notificationId = await schedulePushNotification(item, episode)

      return {
        ...episode,
        notificationId,
      }
    })
  )
  return episodes
}

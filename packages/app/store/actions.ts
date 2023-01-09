import { WatchListItem } from 'app/helpers/types'
import { cancelNotification, scheduleEpisodetNotifications } from 'app/hooks/useNotification'
import { getState, setState, useStore } from 'app/store'

// This isn't reactive, so we shouldn't use in components
export const getWatchListItem = (id: string) =>
  getState().watchlist.find((li) => li.id.toString() === id.toString())

export const useWatchListItem = (id: string) => {
  return useStore((state) => state.watchlist.find((li) => li.id.toString() === id.toString()))
}

export const useItemInWatchList = (id: string) => {
  return useStore((state) => state.watchlist.some((li) => li.id === id))
}

export const addItemToWatchList = async (item: WatchListItem) => {
  const episodes = await scheduleEpisodetNotifications(item)

  const newItem = {
    id: item.id,
    name: item.name,
    image: item.image,
    genres: item.genres,
    language: item.language,
    summary: item.summary,
    type: item.type,
    episodes,
  }

  setState((state) => ({ watchlist: [...state.watchlist, newItem] }))
}

export const removeItemFromWatchList = async (id: string) => {
  const item = getWatchListItem(id)
  const newItems = getState().watchlist.filter((item) => item.id !== id)
  item?.episodes.forEach(async (episode) => {
    if (episode.notificationId) await cancelNotification(episode.notificationId)
  })
  setState({ watchlist: newItems })
}

const updateWatchListItem = async (item: WatchListItem) => {
  setState((state) => {
    const watchlist = [...state.watchlist]
    const itemIndex = watchlist.findIndex((it) => it.id.toString() === item.id.toString())
    watchlist.splice(itemIndex, 1, item)
    return { watchlist }
  })
}

export const setEpisodeStatus = async (itemId: string, episodeId: string, watched: boolean) => {
  const item = getWatchListItem(itemId)
  if (!item) return

  const episodeIndex = item.episodes.findIndex((ep) => ep.id === episodeId)
  const episode = item.episodes[episodeIndex]
  if (!episode) return
  const updatedEpisode = {
    ...episode,
    watched,
  }
  item.episodes.splice(episodeIndex, 1, updatedEpisode)

  await updateWatchListItem(item)
}

export const toggleEpisodeStatus = async (itemId: string, episodeId: string) => {
  const item = getWatchListItem(itemId)
  if (!item) return

  const episode = item.episodes.find((ep) => ep.id === episodeId)
  if (!episode) return

  setEpisodeStatus(itemId, episodeId, !episode.watched)
}

export const setSeasonStatus = async (
  itemId: string,
  season: string | number,
  watched: boolean
) => {
  const item = getWatchListItem(itemId)
  if (!item) return

  const episodes = item.episodes.map((episode) => {
    if (episode.season.toString() !== season.toString()) return episode
    return { ...episode, watched }
  })

  const updatedItem = { ...item, episodes }

  await updateWatchListItem(updatedItem)
}

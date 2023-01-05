import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { useState, useEffect, useMemo } from 'react'
import { WATCHLIST_STORE } from 'app/helpers/constants'
import { WatchListItem } from 'app/helpers/types'
import { EventRegister } from 'react-native-event-listeners'

export const useStore = () => {
  const [watchlist, setWatchList] = useState<WatchListItem[]>([])

  const { getItem, setItem, removeItem } = useAsyncStorage(WATCHLIST_STORE)

  const readItemFromStorage = async () => {
    const items = await getItem()
    // await removeItem()
    setWatchList(items ? JSON.parse(items) : [])
  }

  const writeItemToStorage = async (newValues: WatchListItem[]) => {
    await setItem(JSON.stringify(newValues))
    setWatchList(newValues)
    EventRegister.emit('storage', newValues)
  }

  const addItemToWatchList = async (item: WatchListItem) => {
    writeItemToStorage([
      ...watchlist,
      {
        id: item.id,
        name: item.name,
        image: item.image,
        genres: item.genres,
        language: item.language,
        summary: item.summary,
        type: item.type,
        episodes: item.episodes,
      },
    ])
  }

  const removeItemFromWatchList = async (id: string) => {
    const newItems = watchlist.filter((item) => item.id !== id)
    writeItemToStorage(newItems)
  }

  const updateWatchListItem = async (item: WatchListItem) => {
    const items = [...watchlist]
    const itemIndex = items.findIndex((it) => it.id.toString() === item.id.toString())
    items.splice(itemIndex, 1, item)
    writeItemToStorage(items)
  }

  const getWatchListItem = useMemo(
    () => (itemId: string) => watchlist.find((li) => li.id.toString() === itemId.toString()),
    [watchlist]
  )
  const getItemInWatchList = useMemo(
    () => (item: WatchListItem) => watchlist.some((li) => li.id === item.id),
    [watchlist]
  )

  const setSeasonStatus = (itemId: string, season: string | number, watched: boolean) => {
    const item = getWatchListItem(itemId)
    if (!item) return

    const episodes = item.episodes.map((episode) => {
      if (episode.season.toString() !== season.toString()) return episode
      return { ...episode, watched }
    })

    const updatedItem = { ...item, episodes }

    updateWatchListItem(updatedItem)
  }

  const setEpisodeStatus = (itemId: string, episodeId: string, watched: boolean) => {
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

    updateWatchListItem(item)
  }

  const toggleEpisodeStatus = (itemId: string, episodeId: string) => {
    const item = getWatchListItem(itemId)
    if (!item) return

    const episode = item.episodes.find((ep) => ep.id === episodeId)
    if (!episode) return

    setEpisodeStatus(itemId, episodeId, !episode.watched)
  }

  useEffect(() => {
    readItemFromStorage()

    const storeListener = EventRegister.addEventListener('storage', (data) => {
      setWatchList(data)
    })
    return () => {
      EventRegister.removeEventListener(storeListener as string)
    }
  }, [])

  return {
    watchlist,
    addItemToWatchList,
    removeItemFromWatchList,
    getItemInWatchList,
    getWatchListItem,
    toggleEpisodeStatus,
    setEpisodeStatus,
    setSeasonStatus,
  }
}

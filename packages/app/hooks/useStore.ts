import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react'
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

  const getItemInWatchList = (item: WatchListItem) => watchlist.some((li) => li.id === item.id)

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
  }
}

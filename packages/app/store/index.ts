import create from 'zustand/vanilla'
import createHook from 'zustand'
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { WatchListItem } from 'app/helpers/types'

const asyncStorage: StateStorage = {
  async getItem(name) {
    try {
      const item = await AsyncStorage.getItem(name)
      if (!item) return
      return JSON.parse(item)
    } catch (e) {
      // read error
      return null
    }
  },

  async setItem(name, newValue) {
    try {
      return await AsyncStorage.setItem(name, JSON.stringify(newValue))
    } catch (e) {
      // set error
    }
  },

  async removeItem(name) {
    try {
      await AsyncStorage.removeItem(name)
    } catch (e) {
      // remove error
    }
  },
}

type StoreType = {
  watchlist: WatchListItem[]
}

export const store = create(
  persist<StoreType>(
    (set, get) => ({
      watchlist: [],
    }),

    {
      name: 'flixcart',
      getStorage: () => asyncStorage,
      // storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
export const { getState, setState, subscribe, destroy } = store

export const useStore = createHook(store)

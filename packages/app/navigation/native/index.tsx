import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// import { HomeScreen } from '../../features/home/screen'
// import { UserDetailScreen } from '../../features/user/detail-screen'

import { ItemDetailScreen } from 'app/features/item/detail-screen'
import { WatchListScreen } from 'app/features/watchlist/screen'
import { SearchScreen } from 'app/features/search/screen'
import { useNotification } from 'app/hooks/useNotification'

const Stack = createNativeStackNavigator<{
  home: undefined
  search: undefined
  'user-detail': {
    id: string
  }
  'item-detail': {
    id: string
    type: string
  }
}>()

export function NativeNavigation() {
  useNotification()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={WatchListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="search"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="item-detail"
        component={ItemDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

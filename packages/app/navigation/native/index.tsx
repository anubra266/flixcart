import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { HomeScreen } from '../../features/home/screen'
import { UserDetailScreen } from '../../features/user/detail-screen'

import { ShowDetailScreen } from '../../features/show/detail-screen'
import { WatchListScreen } from 'app/features/watchlist/screen'
import { SearchScreen } from 'app/features/search/screen'

const Stack = createNativeStackNavigator<{
  home: undefined
  search: undefined
  'user-detail': {
    id: string
  }
  'show-detail': {
    id: string
  }
}>()

export function NativeNavigation() {
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
        name="show-detail"
        component={ShowDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

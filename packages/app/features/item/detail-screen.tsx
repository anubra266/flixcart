import { YStack, SafeAreaStack } from '@my/ui'
import { ItemType } from 'app/helpers/constants'
import { useStore } from 'app/hooks/useStore'
import React from 'react'
import { createParam } from 'solito'
import { MovieDetail } from 'app/features/item/movie-detail'
import { ShowDetail } from 'app/features/item/show-detail'

const { useParam } = createParam<{ id: string; type: ItemType }>()

export function ItemDetailScreen() {
  const [id] = useParam('id')
  const [itemType] = useParam('type')

  const { getWatchListItem } = useStore()

  const item = getWatchListItem(id!)

  const renderDetail = () => {
    if (!item) return
    return (
      <YStack f={1}>
        {itemType === ItemType.MOVIE && <MovieDetail item={item} />}

        {itemType === ItemType.SHOW && <ShowDetail item={item} />}
      </YStack>
    )
  }

  return <SafeAreaStack f={1}>{renderDetail()}</SafeAreaStack>
}

import { YStack, SafeAreaStack } from '@my/ui'
import { ItemType } from 'app/helpers/constants'
import React from 'react'
import { createParam } from 'solito'
import { MovieDetail } from 'app/features/item/movie-detail'
import { ShowDetail } from 'app/features/item/show-detail'
import { useWatchListItem } from 'app/store/actions'

const { useParam } = createParam<{ id: string; type: ItemType }>()

export function ItemDetailScreen() {
  const [id] = useParam('id')
  const [itemType] = useParam('type')

  const item = useWatchListItem(id!)

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

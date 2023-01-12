import { YStack, SafeAreaStack } from '@my/ui'
import { ItemType } from 'app/helpers/constants'
import React, { useMemo } from 'react'
import { createParam } from 'solito'
import { MovieDetail } from 'app/features/item/movie-detail'
import { ShowDetail } from 'app/features/item/show-detail'
import { useFlixcartContext } from 'app/context'

const { useParam } = createParam<{ id: string; type: ItemType }>()

export function ItemDetailScreen() {
  const [id] = useParam('id')
  const [itemType] = useParam('type')

  const { getWatchListItem } = useFlixcartContext('flixcart')

  const item = getWatchListItem(id!)

  const renderDetail = useMemo(
    () => () => {
      if (!item) return
      return (
        <YStack f={1}>
          {itemType === ItemType.MOVIE && <MovieDetail item={item} />}

          {itemType === ItemType.SHOW && <ShowDetail item={item} />}
        </YStack>
      )
    },
    [item]
  )

  return <SafeAreaStack f={1}>{renderDetail()}</SafeAreaStack>
}

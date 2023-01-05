import { Button, Paragraph, YStack, SafeAreaStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import React from 'react'
import { createParam } from 'solito'
import { useLink } from 'solito/link'

const { useParam } = createParam<{ id: string }>()

export function ShowDetailScreen() {
  const [id] = useParam('id')
  const linkProps = useLink({ href: '/' })

  return (
    <SafeAreaStack f={1}>
      <YStack f={1} jc="center" ai="center" space>
        <Paragraph ta="center" fow="800">{`User ID: ${id}`}</Paragraph>
        <Button {...linkProps} icon={ChevronLeft}>
          Go Home
        </Button>
      </YStack>
    </SafeAreaStack>
  )
}

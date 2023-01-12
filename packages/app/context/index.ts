import { createContext } from '@my/ui'
import { useStore } from 'app/context/useStore'

type ContextValue = ReturnType<typeof useStore>

export const [FlixcartProvider, useFlixcartContext] = createContext<ContextValue>('flixcart')

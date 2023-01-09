import { ItemType } from 'app/helpers/constants'

export type WatchListItem = {
  id: string
  name: string
  image: string | null

  genres: string[] | null
  language: string
  summary: string | null
  type: ItemType
  episodes: ShowEpisode[]
}

export type ShowEpisode = {
  id: string
  name: string
  season: number
  runtime: number | null
  image: string | null
  summary: string | null
  airDate: Date | null
  status: string | null
  watched?: boolean
  notificationId: string | null
}

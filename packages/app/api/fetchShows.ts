import { ItemType } from 'app/helpers/constants'
import { ShowEpisode, WatchListItem } from 'app/helpers/types'
import axios from 'axios'

const fetchEpisodes = async (id: string): Promise<ShowEpisode[]> => {
  const { data } = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
  const transformedData = data.map((res) => {
    const optionalEpisode = res.name.toLocaleLowerCase().includes('episode')
      ? ''
      : `Episode ${res.number} - `

    return {
      id: res.id,
      name: `${optionalEpisode}${res.name}`,
      season: res.season,
      runtime: res.runtime,
      image: res.image?.original,
      summary: res.summary,
      number: res.number,
      // airDate: new Date('2023-01-09T15:42:00.000Z'),
      airDate: new Date(res.airstamp),
    }
  })
  return transformedData
}

export const fetchShows = async (q: string): Promise<WatchListItem[]> => {
  const { data } = await axios.get(`https://api.tvmaze.com/search/shows?q=${q}`)

  const shows = await Promise.all(
    data.map(async (res) => {
      const episodes = await fetchEpisodes(res.show.id)

      return { ...res.show, type: ItemType.SHOW, image: res.show.image?.original, episodes }
    })
  )

  return shows
}

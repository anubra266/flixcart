import { ItemType } from 'app/helpers/constants'
import { WatchListItem } from 'app/helpers/types'
import axios from 'axios'

import { THE_MOVIE_DB_API_KEY } from '@env'

export type Genre = {
  id: string
  name: string
}

type Detail = {
  runtime: number
  status: string
  imdb_id: string
  genres: Genre[]
}

const API_KEY = THE_MOVIE_DB_API_KEY

export const fetchDetails = async (id: string): Promise<Detail> => {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
  )

  return data
}

export const fetchMovies = async (q: string): Promise<WatchListItem[]> => {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/search/movie?query=${q}&api_key=${API_KEY}&language=en-US&page=1&include_adult=false`
  )

  const movies = await Promise.all(
    data.results.map(async (res) => {
      const image = res.poster_path ? `https://image.tmdb.org/t/p/w500/${res.poster_path}` : null
      const details = await fetchDetails(res.id)

      return {
        ...res,
        name: res.title,
        language: res.original_language.toUpperCase(),
        image,
        genres: details.genres.map((genre) => genre.name),
        summary: res.overview,
        type: ItemType.MOVIE,
        episodes: [
          {
            id: 0,
            name: res.original_title,
            season: 1,
            runtime: details.runtime,
            image,
            summary: res.overview,
            // airDate: new Date('2023-01-09T13:20:00.000Z'),
            airDate: new Date(res.release_date),
            status: details.status,
          },
        ],
      }
    })
  )
  return movies
}

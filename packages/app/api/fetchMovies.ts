import { ItemType } from 'app/helpers/constants'
import { WatchListItem } from 'app/helpers/types'
import axios from 'axios'

export type Genre = {
  id: string
  name: string
}

const API_KEY = 'c28cfea5d4209dab49bfe5cae6b233d2'

export const fetchGenres = async (): Promise<Genre[]> => {
  const { data } =
    await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US

  `)

  return data.genres
}

export const fetchMovies = async (q: string): Promise<WatchListItem[]> => {
  const { data } =
    await axios.get(`https://api.themoviedb.org/3/search/movie?query=${q}&api_key=${API_KEY}&language=en-US&page=1&include_adult=false
  `)

  const allGenres = await fetchGenres()

  return data.results.map((res) => {
    const genres = res.genre_ids.map((id) => allGenres.find((genre) => genre.id === id)?.name)

    const image = res.poster_path ? `https://image.tmdb.org/t/p/w500/${res.poster_path}` : null
    return {
      ...res,
      name: res.title,
      language: res.original_language.toUpperCase(),
      image,
      genres,
      summary: res.overview,
      type: ItemType.MOVIE,
      episodes: [
        {
          id: 0,
          name: res.original_title,
          season: 1,
          runtime: null,
          image,
          summary: res.overview,
          airDate: new Date(res.release_date),
        },
      ],
    }
  })
}

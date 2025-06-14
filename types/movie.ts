export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  genre_ids: number[]
  adult: boolean
}

export interface MovieDetail extends Movie {
  genres: Genre[]
  runtime: number
  budget: number
  revenue: number
  status: string
  tagline: string
  credits: {
    cast: CastMember[]
    crew: CrewMember[]
  }
  videos?: {
    results: Video[]
  }
  similar?: {
    results: Movie[]
  }
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface Genre {
  id: number
  name: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface ApiResponse {
  results: Movie[]
  total_pages: number
  total_results: number
  page: number
}

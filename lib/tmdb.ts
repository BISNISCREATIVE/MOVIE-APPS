const API_KEY = "27158b49b8943955f2815b7b99e0a678"
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNzE1OGI0OWI4OTQzOTU1ZjI4MTViN2I5OWUwYTY3OCIsIm5iZiI6MTc0OTcwOTE1MC44MDksInN1YiI6IjY4NGE3MTVlZjZlZDExNzg0MjM0Mzc2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QlnOilr_89KQE6HpxV611Jz_h0tRXgk64GT7I2LNQJ4"
const BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

// Headers for API requests using Bearer Token
const getHeaders = () => ({
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  "Content-Type": "application/json",
})

// Retry function for failed requests
const fetchWithRetry = async (url: string, options: RequestInit, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      if (response.ok) {
        return response
      }
      if (response.status === 429) {
        // Rate limited, wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
        continue
      }
      if (i === retries - 1) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      if (i === retries - 1) {
        throw error
      }
      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  throw new Error("Max retries exceeded")
}

export const tmdbApi = {
  getTrending: async (page = 1) => {
    try {
      const response = await fetchWithRetry(`${BASE_URL}/trending/movie/week?page=${page}`, {
        headers: getHeaders(),
      })
      return await response.json()
    } catch (error) {
      console.error("Error fetching trending movies:", error)
      throw new Error("Failed to fetch trending movies")
    }
  },

  getPopular: async (page = 1) => {
    try {
      const response = await fetchWithRetry(`${BASE_URL}/movie/popular?page=${page}`, {
        headers: getHeaders(),
      })
      return await response.json()
    } catch (error) {
      console.error("Error fetching popular movies:", error)
      throw new Error("Failed to fetch popular movies")
    }
  },

  getNowPlaying: async (page = 1) => {
    try {
      const response = await fetchWithRetry(`${BASE_URL}/movie/now_playing?page=${page}`, {
        headers: getHeaders(),
      })
      return await response.json()
    } catch (error) {
      console.error("Error fetching now playing movies:", error)
      throw new Error("Failed to fetch now playing movies")
    }
  },

  searchMovies: async (query: string, page = 1) => {
    try {
      const response = await fetchWithRetry(
        `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
        {
          headers: getHeaders(),
        },
      )
      return await response.json()
    } catch (error) {
      console.error("Error searching movies:", error)
      throw new Error("Failed to search movies")
    }
  },

  getMovieDetails: async (id: number) => {
    try {
      const response = await fetchWithRetry(`${BASE_URL}/movie/${id}?append_to_response=credits,videos`, {
        headers: getHeaders(),
      })
      return await response.json()
    } catch (error) {
      console.error("Error fetching movie details:", error)
      throw new Error("Failed to fetch movie details")
    }
  },

  getMovieVideos: async (movieId: number) => {
    try {
      const response = await fetchWithRetry(`${BASE_URL}/movie/${movieId}/videos`, {
        headers: getHeaders(),
      })
      return await response.json()
    } catch (error) {
      console.error("Error fetching movie videos:", error)
      throw new Error("Failed to fetch movie videos")
    }
  },

  getImageUrl: (path: string | null, size = "w500") => {
    if (!path) return "/placeholder.svg?height=750&width=500"
    return `${IMAGE_BASE_URL}/${size}${path}`
  },

  getYouTubeUrl: (key: string) => {
    return `https://www.youtube.com/watch?v=${key}`
  },
}

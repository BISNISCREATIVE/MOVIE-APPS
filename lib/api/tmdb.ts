import { TMDB_CONFIG, IMAGE_SIZES } from "@/lib/constants"
import type { MovieDetail, ApiResponse } from "@/types/movie"

class TMDBApi {
  private baseUrl = TMDB_CONFIG.BASE_URL
  private accessToken = TMDB_CONFIG.ACCESS_TOKEN

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    }
  }

  private async fetchData<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    return response.json()
  }

  async getTrending(page = 1): Promise<ApiResponse> {
    return this.fetchData(`/trending/movie/week?page=${page}`)
  }

  async getPopular(page = 1): Promise<ApiResponse> {
    return this.fetchData(`/movie/popular?page=${page}`)
  }

  async getNowPlaying(page = 1): Promise<ApiResponse> {
    return this.fetchData(`/movie/now_playing?page=${page}`)
  }

  async getUpcoming(page = 1): Promise<ApiResponse> {
    return this.fetchData(`/movie/upcoming?page=${page}`)
  }

  async searchMovies(query: string, page = 1): Promise<ApiResponse> {
    return this.fetchData(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`)
  }

  async getMovieDetails(id: number): Promise<MovieDetail> {
    return this.fetchData(`/movie/${id}?append_to_response=credits,videos,similar`)
  }

  async getMovieVideos(movieId: number) {
    return this.fetchData(`/movie/${movieId}/videos`)
  }

  getImageUrl(path: string | null, size: keyof typeof IMAGE_SIZES = "POSTER"): string {
    if (!path) return "/placeholder.svg?height=750&width=500"
    return `${TMDB_CONFIG.IMAGE_BASE_URL}/${IMAGE_SIZES[size]}${path}`
  }

  getYouTubeUrl(key: string): string {
    return `https://www.youtube.com/watch?v=${key}`
  }
}

export const tmdbApi = new TMDBApi()

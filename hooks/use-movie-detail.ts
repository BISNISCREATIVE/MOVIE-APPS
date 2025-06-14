"use client"

import { useState, useEffect } from "react"
import { tmdbApi } from "@/lib/api/tmdb"
import type { MovieDetail } from "@/types/movie"

export function useMovieDetail(movieId: number) {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails()
    }
  }, [movieId])

  const fetchMovieDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [movieData, videosData] = await Promise.all([
        tmdbApi.getMovieDetails(movieId),
        tmdbApi.getMovieVideos(movieId),
      ])

      setMovie(movieData)

      // Find trailer video
      const trailer = videosData.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube")
      setTrailerKey(trailer?.key || null)
    } catch (err) {
      console.error("Error fetching movie details:", err)
      setError("Failed to load movie details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = () => {
    fetchMovieDetails()
  }

  return {
    movie,
    isLoading,
    error,
    trailerKey,
    refetch,
  }
}

"use client"

import { useState, useCallback } from "react"
import type { Movie, ApiResponse } from "@/types/movie"

interface UseInfiniteMoviesProps {
  initialData?: ApiResponse
  fetchFunction: (page: number) => Promise<ApiResponse>
}

export function useInfiniteMovies({ initialData, fetchFunction }: UseInfiniteMoviesProps) {
  const [movies, setMovies] = useState<Movie[]>(initialData?.results || [])
  const [currentPage, setCurrentPage] = useState(initialData?.page || 1)
  const [totalPages, setTotalPages] = useState(initialData?.total_pages || 1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMore = useCallback(async () => {
    if (isLoading || currentPage >= totalPages) return

    setIsLoading(true)
    setError(null)

    try {
      const nextPage = currentPage + 1
      console.log(`Loading page ${nextPage} of ${totalPages}`)

      const response = await fetchFunction(nextPage)

      if (!response || !response.results) {
        throw new Error("Invalid response format")
      }

      setMovies((prev) => {
        // Remove duplicates based on movie ID
        const existingIds = new Set(prev.map((movie) => movie.id))
        const newMovies = response.results.filter((movie) => !existingIds.has(movie.id))
        console.log(`Added ${newMovies.length} new movies`)
        return [...prev, ...newMovies]
      })

      setCurrentPage(nextPage)
      setTotalPages(response.total_pages || totalPages)
    } catch (err) {
      console.error("Error loading more movies:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(`Failed to load more movies: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, totalPages, isLoading, fetchFunction])

  const reset = useCallback((newData?: ApiResponse) => {
    if (newData) {
      setMovies(newData.results || [])
      setCurrentPage(newData.page || 1)
      setTotalPages(newData.total_pages || 1)
    } else {
      setMovies([])
      setCurrentPage(1)
      setTotalPages(1)
    }
    setError(null)
  }, [])

  const hasMore = currentPage < totalPages
  const canLoadMore = hasMore && !isLoading && !error

  return {
    movies,
    isLoading,
    error,
    hasMore,
    canLoadMore,
    loadMore,
    reset,
    currentPage,
    totalPages,
  }
}

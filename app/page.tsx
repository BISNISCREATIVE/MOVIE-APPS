"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/movie/hero-section"
import { MovieGrid } from "@/components/movie/movie-grid"
import { SearchResults } from "@/components/movie/search-results"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useInfiniteMovies } from "@/hooks/use-infinite-movies"
import { tmdbApi } from "@/lib/tmdb"
import type { Movie } from "@/types/movie"
import { TrendingCarousel } from "@/components/movie/trending-carousel"

// Fallback data in case API fails
const fallbackMovies: Movie[] = [
  {
    id: 1,
    title: "Sample Movie 1",
    overview: "This is a sample movie for demonstration purposes.",
    poster_path: null,
    backdrop_path: null,
    release_date: "2024-01-01",
    vote_average: 7.5,
    genre_ids: [28, 12],
    adult: false,
  },
  {
    id: 2,
    title: "Sample Movie 2",
    overview: "Another sample movie for demonstration purposes.",
    poster_path: null,
    backdrop_path: null,
    release_date: "2024-02-01",
    vote_average: 8.0,
    genre_ids: [35, 18],
    adult: false,
  },
]

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use infinite movies hook for New Releases
  const {
    movies: newReleases,
    isLoading: isLoadingMore,
    error: loadMoreError,
    hasMore,
    canLoadMore,
    loadMore,
    reset: resetNewReleases,
    currentPage,
    totalPages,
  } = useInfiniteMovies({
    fetchFunction: (page) => tmdbApi.getNowPlaying(page),
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setIsInitialLoading(true)
      setError(null)

      console.log("Fetching initial data...")

      // Try to fetch data with timeout
      const fetchWithTimeout = (promise: Promise<any>, timeout = 10000) => {
        return Promise.race([
          promise,
          new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeout)),
        ])
      }

      const [trendingResponse, newReleasesResponse] = await Promise.allSettled([
        fetchWithTimeout(tmdbApi.getTrending()),
        fetchWithTimeout(tmdbApi.getNowPlaying(1)),
      ])

      // Handle trending movies
      if (trendingResponse.status === "fulfilled") {
        console.log("Trending movies:", trendingResponse.value.results?.length)
        setTrendingMovies(trendingResponse.value.results || fallbackMovies)
      } else {
        console.error("Failed to fetch trending movies:", trendingResponse.reason)
        setTrendingMovies(fallbackMovies)
      }

      // Handle new releases
      if (newReleasesResponse.status === "fulfilled") {
        console.log("New releases:", newReleasesResponse.value.results?.length)
        console.log("New releases total pages:", newReleasesResponse.value.total_pages)
        resetNewReleases(newReleasesResponse.value)
      } else {
        console.error("Failed to fetch new releases:", newReleasesResponse.reason)
        resetNewReleases({
          results: fallbackMovies,
          page: 1,
          total_pages: 1,
          total_results: fallbackMovies.length,
        })
      }

      // Show error only if both requests failed
      if (trendingResponse.status === "rejected" && newReleasesResponse.status === "rejected") {
        setError("Unable to load movies. Please check your internet connection and try again.")
      }
    } catch (err) {
      console.error("Error fetching movies:", err)
      setError("Failed to load movies. Using sample data.")

      // Use fallback data
      setTrendingMovies(fallbackMovies)
      resetNewReleases({
        results: fallbackMovies,
        page: 1,
        total_pages: 1,
        total_results: fallbackMovies.length,
      })
    } finally {
      setIsInitialLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setSearchQuery("")
      return
    }

    try {
      const results = await tmdbApi.searchMovies(query)
      setSearchResults(results.results || [])
      setSearchQuery(query)
    } catch (err) {
      console.error("Search error:", err)
      setSearchResults([])
      setSearchQuery(query)
    }
  }

  const handleClearSearch = () => {
    setSearchResults([])
    setSearchQuery("")
  }

  const handleLoadMore = () => {
    console.log("Load more clicked, canLoadMore:", canLoadMore)
    if (canLoadMore) {
      loadMore()
    }
  }

  const handleRetry = () => {
    fetchInitialData()
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-400">Loading amazing movies...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen">
      <Header onSearch={handleSearch} onClearSearch={handleClearSearch} />

      {searchResults.length > 0 || searchQuery ? (
        <SearchResults movies={searchResults} query={searchQuery} onClear={handleClearSearch} />
      ) : (
        <>
          <HeroSection />
          <div className="space-y-16 pb-12">
            {/* Error Banner */}
            {error && (
              <div className="container mx-auto px-4">
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-yellow-400 text-sm">{error}</span>
                    </div>
                    <button onClick={handleRetry} className="text-yellow-400 hover:text-yellow-300 text-sm underline">
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Trending Movies - Enhanced Carousel */}
            <TrendingCarousel movies={trendingMovies} />

            {/* New Releases - Grid with Load More */}
            <MovieGrid
              movies={newReleases}
              title="New Release"
              variant="grid"
              showLoadMore={true}
              isLoading={isLoadingMore}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              error={loadMoreError}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </>
      )}
    </div>
  )
}

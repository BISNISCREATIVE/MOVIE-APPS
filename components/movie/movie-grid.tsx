"use client"

import { MovieCard } from "./movie-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertCircle, ChevronDown, Film } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Movie } from "@/types/movie"

interface MovieGridProps {
  movies: Movie[]
  title: string
  variant?: "grid" | "carousel"
  showLoadMore?: boolean
  isLoading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  error?: string | null
  className?: string
  currentPage?: number
  totalPages?: number
}

export function MovieGrid({
  movies,
  title,
  variant = "grid",
  showLoadMore = false,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  error,
  className,
  currentPage = 1,
  totalPages = 1,
}: MovieGridProps) {
  if (movies.length === 0 && !isLoading) {
    return null
  }

  return (
    <section className={cn("py-8", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>
              {movies.length} movie{movies.length !== 1 ? "s" : ""}
            </span>
            {showLoadMore && totalPages > 1 && (
              <span>
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
        </div>

        {variant === "carousel" ? (
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {movies.slice(0, 10).map((movie, index) => (
                <div key={`${movie.id}-${index}`} className="relative flex-shrink-0 w-32 md:w-40">
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10 font-medium">
                    {index + 1}
                  </div>
                  <MovieCard movie={movie} variant="carousel" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Movie Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {movies.map((movie, index) => (
                <MovieCard key={`${movie.id}-${index}`} movie={movie} />
              ))}
            </div>

            {/* Load More Section - Always show if showLoadMore is true */}
            {showLoadMore && (
              <div className="mt-12 text-center">
                {error ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="w-5 h-5" />
                      <span>{error}</span>
                    </div>
                    <button
                      onClick={onLoadMore}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
                    >
                      <Film className="w-5 h-5" />
                      Try Again
                    </button>
                  </div>
                ) : isLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <LoadingSpinner size="lg" />
                    <p className="text-gray-400">Loading more amazing movies...</p>
                  </div>
                ) : hasMore ? (
                  <div className="space-y-4">
                    <button
                      onClick={onLoadMore}
                      className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Film className="w-5 h-5" />
                      <span>Load More Movies</span>
                      <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    </button>
                    <p className="text-gray-500 text-sm">
                      Showing {movies.length} movies • {totalPages - currentPage} more pages available
                    </p>
                  </div>
                ) : (
                  movies.length > 0 && (
                    <div className="space-y-4">
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                      <div className="text-gray-500 text-sm flex items-center justify-center gap-2">
                        <Film className="w-4 h-4" />
                        <span>You've explored all {movies.length} movies!</span>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

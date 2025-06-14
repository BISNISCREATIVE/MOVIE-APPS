"use client"

import { MovieCard } from "./movie-card"
import { EmptyStateIcon } from "@/components/ui/empty-state-icon"
import type { Movie } from "@/types/movie"

interface SearchResultsProps {
  movies: Movie[]
  query: string
  onClear: () => void
}

export function SearchResults({ movies, query, onClear }: SearchResultsProps) {
  if (movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          {/* Updated Empty State for Search */}
          <div className="mb-8">
            <EmptyStateIcon width={180} height={180} />
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">No Results Found</h2>
          <p className="text-gray-400 mb-6">No movies found for "{query}". Try searching with different keywords.</p>
          <button
            onClick={onClear}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Search Results for "{query}" ({movies.length})
        </h2>
        <button onClick={onClear} className="text-gray-400 hover:text-white text-sm underline">
          Clear Results
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}

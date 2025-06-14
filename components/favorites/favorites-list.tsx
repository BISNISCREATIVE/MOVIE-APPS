"use client"

import { useState } from "react"
import { FavoriteMovieCard } from "./favorite-movie-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyStateIcon } from "@/components/ui/empty-state-icon"
import { Search, SortAsc, SortDesc, Calendar, Star } from "lucide-react"
import type { Movie } from "@/types/movie"

interface FavoritesListProps {
  movies: Movie[]
}

type SortOption = "title" | "rating" | "date" | "added"
type SortOrder = "asc" | "desc"

export function FavoritesList({ movies }: FavoritesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("added")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [isLoading, setIsLoading] = useState(false)

  // Filter movies based on search term
  const filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))

  // Sort movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortBy) {
      case "title":
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case "rating":
        aValue = a.vote_average
        bValue = b.vote_average
        break
      case "date":
        aValue = new Date(a.release_date).getTime()
        bValue = new Date(b.release_date).getTime()
        break
      case "added":
      default:
        // For "added", we'll use the movie ID as a proxy (newer movies typically have higher IDs)
        aValue = a.id
        bValue = b.id
        break
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const handleSortChange = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(newSortBy)
      setSortOrder("desc")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search your favorites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 text-white pl-10 pr-4 py-3 rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm mr-2">Sort by:</span>
          <button
            onClick={() => handleSortChange("title")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              sortBy === "title" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Title
            {sortBy === "title" &&
              (sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />)}
          </button>
          <button
            onClick={() => handleSortChange("rating")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              sortBy === "rating" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Star className="w-4 h-4" />
            {sortBy === "rating" &&
              (sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />)}
          </button>
          <button
            onClick={() => handleSortChange("date")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              sortBy === "date" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Calendar className="w-4 h-4" />
            {sortBy === "date" &&
              (sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />)}
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="text-gray-400">
          {searchTerm ? (
            <span>
              {filteredMovies.length} of {movies.length} favorites
              {searchTerm && (
                <>
                  {" "}
                  matching "<span className="text-white">{searchTerm}</span>"
                </>
              )}
            </span>
          ) : (
            <span>
              {movies.length} favorite movie{movies.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Movies List */}
      {sortedMovies.length === 0 ? (
        <div className="text-center py-16">
          {/* Updated Empty State for Search */}
          <div className="mb-6">
            <EmptyStateIcon width={160} height={160} />
          </div>

          <div className="text-gray-400 mb-4">
            {searchTerm ? "No favorites match your search." : "No favorite movies found."}
          </div>
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-red-400 hover:text-red-300 underline">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMovies.map((movie, index) => (
            <FavoriteMovieCard key={`${movie.id}-${index}`} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}

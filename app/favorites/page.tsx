"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { FavoritesList } from "@/components/favorites/favorites-list"
import { FavoritesEmptyState } from "@/components/favorites/favorites-empty-state"
import { FavoritesStats } from "@/components/favorites/favorites-stats"
import { SearchResults } from "@/components/movie/search-results"
import { useFavorites } from "@/hooks/use-favorites"
import { tmdbApi } from "@/lib/api/tmdb"
import type { Movie } from "@/types/movie"

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [searchQuery, setSearchQuery] = useState("")

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
    }
  }

  const handleClearSearch = () => {
    setSearchResults([])
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-black">
      <Header onSearch={handleSearch} onClearSearch={handleClearSearch} />

      {searchResults.length > 0 || searchQuery ? (
        <SearchResults movies={searchResults} query={searchQuery} onClear={handleClearSearch} />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Favorites</h1>

          {favorites.length === 0 ? (
            <FavoritesEmptyState />
          ) : (
            <>
              <FavoritesStats />
              <FavoritesList movies={favorites} />
            </>
          )}
        </div>
      )}
    </div>
  )
}

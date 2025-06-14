"use client"

import { useLocalStorage } from "./use-local-storage"
import type { Movie } from "@/types/movie"

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<Movie[]>("movie-favorites", [])

  const addToFavorites = (movie: Movie) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === movie.id)) {
        return prev
      }
      return [...prev, movie]
    })
  }

  const removeFromFavorites = (movieId: number) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId))
  }

  const isFavorite = (movieId: number) => {
    return favorites.some((movie) => movie.id === movieId)
  }

  const toggleFavorite = (movie: Movie) => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id)
      return false
    } else {
      addToFavorites(movie)
      return true
    }
  }

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  }
}

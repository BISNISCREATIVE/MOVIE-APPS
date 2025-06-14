"use client"

import { useFavorites } from "@/hooks/use-favorites"
import { Heart, Star, Calendar, TrendingUp } from "lucide-react"

export function FavoritesStats() {
  const { favorites } = useFavorites()

  if (favorites.length === 0) return null

  const averageRating = favorites.reduce((sum, movie) => sum + movie.vote_average, 0) / favorites.length
  const latestYear = Math.max(...favorites.map((movie) => new Date(movie.release_date).getFullYear()))
  const totalMovies = favorites.length

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500" />
          <div>
            <div className="text-2xl font-bold text-white">{totalMovies}</div>
            <div className="text-xs text-gray-400">Total Favorites</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
        <div className="flex items-center gap-3">
          <Star className="w-8 h-8 text-yellow-500" />
          <div>
            <div className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</div>
            <div className="text-xs text-gray-400">Avg Rating</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-500" />
          <div>
            <div className="text-2xl font-bold text-white">{latestYear}</div>
            <div className="text-xs text-gray-400">Latest Year</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-green-500" />
          <div>
            <div className="text-2xl font-bold text-white">
              {favorites.filter((movie) => movie.vote_average >= 7).length}
            </div>
            <div className="text-xs text-gray-400">High Rated</div>
          </div>
        </div>
      </div>
    </div>
  )
}

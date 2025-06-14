"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Star, Heart, Play, Calendar, Eye } from "lucide-react"
import { tmdbApi } from "@/lib/api/tmdb"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Movie } from "@/types/movie"

interface FavoriteMovieCardProps {
  movie: Movie
}

export function FavoriteMovieCard({ movie }: FavoriteMovieCardProps) {
  const router = useRouter()
  const { removeFromFavorites } = useFavorites()
  const { showToast } = useToast()
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const handleCardClick = () => {
    router.push(`/movie/${movie.id}`)
  }

  const handleRemoveFromFavorites = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeFromFavorites(movie.id)
    showToast("Removed from favorites", "info")
  }

  const handleWatchTrailer = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/movie/${movie.id}`)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).getFullYear()
  }

  const formatRating = (rating: number) => {
    return rating ? rating.toFixed(1) : "N/A"
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div
      className="group bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all cursor-pointer hover:bg-gray-900/70"
      onClick={handleCardClick}
    >
      <div className="flex gap-4 p-4">
        {/* Movie Poster */}
        <div className="relative w-20 h-28 md:w-24 md:h-36 flex-shrink-0">
          {!imageError ? (
            <Image
              src={tmdbApi.getImageUrl(movie.poster_path) || "/placeholder.svg"}
              alt={movie.title}
              fill
              className={cn("object-cover rounded-lg transition-opacity", imageLoading ? "opacity-0" : "opacity-100")}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true)
                setImageLoading(false)
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-gray-600" />
            </div>
          )}
          {imageLoading && <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg" />}
        </div>

        {/* Movie Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-lg md:text-xl mb-2 truncate group-hover:text-red-400 transition-colors">
                {movie.title}
              </h3>

              <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{formatRating(movie.vote_average)}/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
              </div>
            </div>

            {/* Remove from Favorites */}
            <button
              onClick={handleRemoveFromFavorites}
              className="p-2 rounded-full text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Remove from favorites"
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Movie Overview */}
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 line-clamp-2 md:line-clamp-3">
            {truncateText(movie.overview || "No description available.", 200)}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleWatchTrailer}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" />
              Watch Trailer
            </button>

            <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
              <span>•</span>
              <span>Added to favorites</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent md:hidden" />
    </div>
  )
}

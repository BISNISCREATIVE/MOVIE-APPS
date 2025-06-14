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

interface MovieCardProps {
  movie: Movie
  variant?: "grid" | "list" | "carousel"
  className?: string
}

export function MovieCard({ movie, variant = "grid", className }: MovieCardProps) {
  const router = useRouter()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const handleCardClick = () => {
    router.push(`/movie/${movie.id}`)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const added = toggleFavorite(movie)
    showToast(added ? "Added to favorites" : "Removed from favorites", added ? "success" : "info")
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).getFullYear()
  }

  const formatRating = (rating: number) => {
    return rating ? rating.toFixed(1) : "N/A"
  }

  if (variant === "list") {
    return (
      <div
        className={cn(
          "group bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all cursor-pointer hover:bg-gray-900/70",
          className,
        )}
        onClick={handleCardClick}
      >
        <div className="flex gap-4 p-4">
          <div className="relative w-20 h-28 flex-shrink-0">
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

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg mb-2 truncate group-hover:text-red-400 transition-colors">
              {movie.title}
            </h3>

            <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{formatRating(movie.vote_average)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(movie.release_date)}</span>
              </div>
            </div>

            <p className="text-gray-300 text-sm line-clamp-2 mb-4">{movie.overview || "No description available."}</p>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle trailer click
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                Watch Trailer
              </button>

              <button
                onClick={handleFavoriteClick}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isFavorite(movie.id) ? "text-red-500 hover:text-red-400" : "text-gray-400 hover:text-red-500",
                )}
              >
                <Heart className={cn("w-5 h-5", isFavorite(movie.id) && "fill-current")} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group relative cursor-pointer transition-transform hover:scale-105",
        variant === "carousel" && "flex-shrink-0 w-40",
        className,
      )}
      onClick={handleCardClick}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800">
        {!imageError ? (
          <Image
            src={tmdbApi.getImageUrl(movie.poster_path) || "/placeholder.svg"}
            alt={movie.title}
            fill
            className={cn("object-cover transition-all", imageLoading ? "opacity-0" : "opacity-100")}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true)
              setImageLoading(false)
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <Eye className="w-8 h-8 text-gray-600" />
          </div>
        )}

        {imageLoading && <div className="absolute inset-0 bg-gray-800 animate-pulse" />}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100",
            isFavorite(movie.id) ? "bg-red-500/80 text-white" : "bg-black/50 text-gray-300 hover:text-red-500",
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite(movie.id) && "fill-current")} />
        </button>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="mt-3">
        <h3 className="text-white font-medium text-sm truncate group-hover:text-red-400 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs text-gray-400">{formatRating(movie.vote_average)}</span>
          </div>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-400">{formatDate(movie.release_date)}</span>
        </div>
      </div>
    </div>
  )
}

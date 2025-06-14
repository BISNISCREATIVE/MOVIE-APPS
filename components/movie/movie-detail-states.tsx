"use client"

import { Heart, Play, AlertCircle, Star, Users, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface MovieDetailStatesProps {
  isFavorite: boolean
  hasTrailer: boolean
  onFavoriteClick: () => void
  onTrailerClick: () => void
  rating: number
  genre: string
  ageLimit: string
}

export function MovieDetailStates({
  isFavorite,
  hasTrailer,
  onFavoriteClick,
  onTrailerClick,
  rating,
  genre,
  ageLimit,
}: MovieDetailStatesProps) {
  return (
    <div className="space-y-8">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Watch Trailer Button */}
        {hasTrailer ? (
          <button
            onClick={onTrailerClick}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-3 transition-colors"
          >
            <Play className="w-5 h-5" />
            Watch Trailer
          </button>
        ) : (
          <div className="bg-gray-700 text-gray-400 px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-3 cursor-not-allowed">
            <AlertCircle className="w-5 h-5" />
            No Trailer Available
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={onFavoriteClick}
          className={cn(
            "p-4 rounded-full transition-colors border-2 flex items-center justify-center",
            isFavorite
              ? "bg-red-600 border-red-600 text-white"
              : "border-gray-600 text-gray-300 hover:border-red-600 hover:text-red-600",
          )}
        >
          <Heart className={cn("w-6 h-6", isFavorite && "fill-current")} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl text-center border border-gray-800">
          <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <div className="text-xs text-gray-400 mb-1">Rating</div>
          <div className="font-bold text-lg">{rating}/10</div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl text-center border border-gray-800">
          <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-xs text-gray-400 mb-1">Genre</div>
          <div className="font-bold text-lg">{genre}</div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl text-center border border-gray-800">
          <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-xs text-gray-400 mb-1">Age Limit</div>
          <div className="font-bold text-lg">{ageLimit}</div>
        </div>
      </div>
    </div>
  )
}

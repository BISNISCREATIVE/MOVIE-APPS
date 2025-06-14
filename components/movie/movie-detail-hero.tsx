"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Heart, Star, Users, Calendar, AlertCircle } from "lucide-react"
import { SuccessToast } from "@/components/ui/success-toast"
import { tmdbApi } from "@/lib/api/tmdb"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { MovieDetail } from "@/types/movie"

interface MovieDetailHeroProps {
  movie: MovieDetail
  trailerKey: string | null
  onWatchTrailer: () => void
}

export function MovieDetailHero({ movie, trailerKey, onWatchTrailer }: MovieDetailHeroProps) {
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()

  const handleFavoriteClick = () => {
    const added = toggleFavorite(movie)
    if (added) {
      setShowSuccessToast(true)
    }
    showToast(added ? "Success Add to Favorites" : "Removed from favorites", added ? "success" : "info")
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <>
      {/* Success Toast */}
      <SuccessToast
        message="Success Add to Favorites"
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Hero Section */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 h-screen">
          <Image
            src={tmdbApi.getImageUrl(movie.backdrop_path, "ORIGINAL") || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 pt-8 pb-16 min-h-screen">
          <div className="container mx-auto px-4">
            {/* Movie Content */}
            <div className="flex flex-col md:flex-row gap-8 items-start pt-16 md:pt-32">
              {/* Poster */}
              <div className="w-full max-w-[280px] mx-auto md:mx-0 flex-shrink-0">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                  <Image
                    src={tmdbApi.getImageUrl(movie.poster_path) || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 text-white text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{movie.title}</h1>

                {/* Release Date */}
                <div className="flex items-center justify-center md:justify-start gap-2 mb-6 text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg">{formatDate(movie.release_date)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                  {/* Watch Trailer Button */}
                  {trailerKey ? (
                    <button
                      onClick={onWatchTrailer}
                      className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-3 transition-colors text-lg"
                    >
                      <Play className="w-5 h-5" />
                      Watch Trailer
                    </button>
                  ) : (
                    <div className="w-full md:w-auto bg-gray-700 text-gray-400 px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-3 cursor-not-allowed text-lg">
                      <AlertCircle className="w-5 h-5" />
                      No Trailer Available
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={handleFavoriteClick}
                    className="p-4 rounded-full transition-colors border-2 border-gray-600 hover:border-red-600 flex items-center justify-center"
                  >
                    <Heart
                      className={cn(
                        "w-6 h-6 transition-colors",
                        isFavorite(movie.id) ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-red-500",
                      )}
                    />
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto md:mx-0">
                  <div className="bg-black/50 backdrop-blur-sm p-4 rounded-xl text-center border border-gray-800">
                    <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <div className="text-xs text-gray-400 mb-1">Rating</div>
                    <div className="font-bold text-lg">{movie.vote_average.toFixed(1)}/10</div>
                  </div>

                  <div className="bg-black/50 backdrop-blur-sm p-4 rounded-xl text-center border border-gray-800">
                    <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-xs text-gray-400 mb-1">Genre</div>
                    <div className="font-bold text-lg">{movie.genres?.[0]?.name || "Action"}</div>
                  </div>

                  <div className="bg-black/50 backdrop-blur-sm p-4 rounded-xl text-center border border-gray-800">
                    <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <div className="text-xs text-gray-400 mb-1">Age Limit</div>
                    <div className="font-bold text-lg">{movie.adult ? "18+" : "13"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

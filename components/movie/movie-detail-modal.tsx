"use client"

import { useState, useEffect } from "react"
import { X, Play, Heart, Star, Calendar, Clock, Users } from "lucide-react"
import Image from "next/image"
import { tmdbApi } from "@/lib/tmdb"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"
import type { MovieDetail } from "@/types/movie"

interface MovieDetailModalProps {
  movieId: number
  isOpen: boolean
  onClose: () => void
}

export function MovieDetailModal({ movieId, isOpen, onClose }: MovieDetailModalProps) {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)

  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites()
  const { showToast } = useToast()

  useEffect(() => {
    if (isOpen && movieId) {
      fetchMovieDetails()
    }
  }, [isOpen, movieId])

  const fetchMovieDetails = async () => {
    setIsLoading(true)
    try {
      const [movieData, videosData] = await Promise.all([
        tmdbApi.getMovieDetails(movieId),
        tmdbApi.getMovieVideos(movieId),
      ])

      setMovie(movieData)

      // Find trailer video
      const trailer = videosData.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube")
      setTrailerKey(trailer?.key || null)
    } catch (error) {
      console.error("Error fetching movie details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFavoriteClick = () => {
    if (!movie) return

    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id)
      showToast("Removed from favorites", "info")
    } else {
      addToFavorites(movie)
      showToast("Success Add to Favorites", "success")
    }
  }

  const handleWatchTrailer = () => {
    if (trailerKey) {
      window.open(tmdbApi.getYouTubeUrl(trailerKey), "_blank")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Movie Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading...</div>
          </div>
        ) : movie ? (
          <div className="p-6">
            {/* Movie Header */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-full md:w-64 flex-shrink-0">
                <Image
                  src={tmdbApi.getImageUrl(movie.poster_path) || "/placeholder.svg"}
                  alt={movie.title}
                  width={256}
                  height={384}
                  className="w-full rounded-lg"
                />
              </div>

              <div className="flex-1 text-white">
                <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(movie.release_date).getFullYear()}
                  </div>
                  {movie.runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {movie.runtime} min
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {movie.vote_average.toFixed(1)}/10
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres?.map((genre) => (
                    <span key={genre.id} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mb-6">
                  {trailerKey && (
                    <button
                      onClick={handleWatchTrailer}
                      className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      Watch Trailer
                    </button>
                  )}

                  <button
                    onClick={handleFavoriteClick}
                    className={`p-3 rounded-full transition-colors ${
                      isFavorite(movie.id) ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:text-red-500"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(movie.id) ? "fill-current" : ""}`} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-800 p-3 rounded-lg text-center">
                    <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                    <div className="text-sm text-gray-400">Rating</div>
                    <div className="font-bold">{movie.vote_average.toFixed(1)}/10</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg text-center">
                    <Users className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                    <div className="text-sm text-gray-400">Genre</div>
                    <div className="font-bold">{movie.genres?.[0]?.name || "N/A"}</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg text-center">
                    <Calendar className="w-6 h-6 text-green-500 mx-auto mb-1" />
                    <div className="text-sm text-gray-400">Age Limit</div>
                    <div className="font-bold">{movie.adult ? "18+" : "13+"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Overview</h3>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>

            {/* Cast & Crew */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Cast & Crew</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {movie.credits.cast.slice(0, 6).map((actor) => (
                    <div key={actor.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                        {actor.profile_path ? (
                          <Image
                            src={tmdbApi.getImageUrl(actor.profile_path, "w185") || "/placeholder.svg"}
                            alt={actor.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Users className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="text-white">
                        <div className="font-medium">{actor.name}</div>
                        <div className="text-sm text-gray-400">{actor.character}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Failed to load movie details</div>
          </div>
        )}
      </div>
    </div>
  )
}

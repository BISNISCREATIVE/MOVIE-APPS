"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { X, Play, Heart, Star, Calendar, Clock } from "lucide-react"
import { tmdbApi } from "@/lib/api/tmdb"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { MovieDetail } from "@/types/movie"

interface QuickMoviePreviewProps {
  movieId: number
  isOpen: boolean
  onClose: () => void
}

export function QuickMoviePreview({ movieId, isOpen, onClose }: QuickMoviePreviewProps) {
  const router = useRouter()
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()

  useEffect(() => {
    if (isOpen && movieId) {
      fetchMovieDetails()
    }
  }, [isOpen, movieId])

  const fetchMovieDetails = async () => {
    setIsLoading(true)
    try {
      const movieData = await tmdbApi.getMovieDetails(movieId)
      setMovie(movieData)
    } catch (error) {
      console.error("Error fetching movie details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFavoriteClick = () => {
    if (!movie) return
    const added = toggleFavorite(movie)
    showToast(added ? "Added to favorites" : "Removed from favorites", added ? "success" : "info")
  }

  const handleSeeFullDetail = () => {
    router.push(`/movie/${movieId}`)
    onClose()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).getFullYear()
  }

  const formatRuntime = (minutes: number) => {
    if (!minutes) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Quick Preview</h2>
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
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="w-full md:w-48 flex-shrink-0">
                <Image
                  src={tmdbApi.getImageUrl(movie.poster_path) || "/placeholder.svg"}
                  alt={movie.title}
                  width={192}
                  height={288}
                  className="w-full rounded-lg"
                />
              </div>

              <div className="flex-1 text-white">
                <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(movie.release_date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatRuntime(movie.runtime)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {movie.vote_average.toFixed(1)}/10
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres?.slice(0, 3).map((genre) => (
                    <span key={genre.id} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                      {genre.name}
                    </span>
                  ))}
                </div>

                <p className="text-gray-300 mb-6 line-clamp-3">{movie.overview}</p>

                <div className="flex gap-4">
                  <button
                    onClick={handleSeeFullDetail}
                    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    See Full Detail
                  </button>

                  <button
                    onClick={handleFavoriteClick}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      isFavorite(movie.id) ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:text-red-500",
                    )}
                  >
                    <Heart className={cn("w-5 h-5", isFavorite(movie.id) && "fill-current")} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-sm text-gray-400">Rating</div>
                <div className="font-bold text-white">{movie.vote_average.toFixed(1)}/10</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-sm text-gray-400">Duration</div>
                <div className="font-bold text-white">{formatRuntime(movie.runtime)}</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-sm text-gray-400">Year</div>
                <div className="font-bold text-white">{formatDate(movie.release_date)}</div>
              </div>
            </div>
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

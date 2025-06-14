"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Play, Heart, Star, Calendar, Clock, Users, Globe, DollarSign } from "lucide-react"
import { Header } from "@/components/layout/header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { MovieGrid } from "@/components/movie/movie-grid"
import { tmdbApi } from "@/lib/api/tmdb"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { MovieDetail } from "@/types/movie"

interface MovieOverviewPageProps {
  movieId: number
}

export function MovieOverviewPage({ movieId }: MovieOverviewPageProps) {
  const router = useRouter()
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails()
    }
  }, [movieId])

  const fetchMovieDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const movieData = await tmdbApi.getMovieDetails(movieId)
      setMovie(movieData)
    } catch (err) {
      console.error("Error fetching movie details:", err)
      setError("Failed to load movie details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFavoriteClick = () => {
    if (!movie) return

    const added = toggleFavorite(movie)
    showToast(added ? "Added to favorites" : "Removed from favorites", added ? "success" : "info")
  }

  const handleWatchNow = () => {
    router.push(`/movie/${movieId}`)
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

  const formatRuntime = (minutes: number) => {
    if (!minutes) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatCurrency = (amount: number) => {
    if (!amount) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-400">Loading movie overview...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || "Movie not found"}</p>
            <button
              onClick={() => router.back()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 h-[70vh]">
          <Image
            src={tmdbApi.getImageUrl(movie.backdrop_path, "ORIGINAL") || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 pt-8 pb-16 h-[70vh] flex items-end">
          <div className="container mx-auto px-4">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>

            {/* Movie Info */}
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>{movie.vote_average.toFixed(1)}/10</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm border border-red-600/30"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">{movie.overview}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleWatchNow}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-3 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Watch Now
                </button>

                <button
                  onClick={handleFavoriteClick}
                  className={cn(
                    "border-2 px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-3 transition-colors",
                    isFavorite(movie.id)
                      ? "bg-red-600 border-red-600 text-white"
                      : "border-white text-white hover:bg-white hover:text-black",
                  )}
                >
                  <Heart className={cn("w-5 h-5", isFavorite(movie.id) && "fill-current")} />
                  {isFavorite(movie.id) ? "Remove from Favorites" : "Add to Favorites"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="bg-black">
        <div className="container mx-auto px-4 py-16">
          {/* Movie Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{movie.vote_average.toFixed(1)}</div>
              <div className="text-gray-400 text-sm">IMDb Rating</div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{formatRuntime(movie.runtime)}</div>
              <div className="text-gray-400 text-sm">Duration</div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 text-center">
              <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{formatCurrency(movie.budget)}</div>
              <div className="text-gray-400 text-sm">Budget</div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 text-center">
              <Globe className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{formatCurrency(movie.revenue)}</div>
              <div className="text-gray-400 text-sm">Revenue</div>
            </div>
          </div>

          {/* Movie Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={tmdbApi.getImageUrl(movie.poster_path) || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Synopsis */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed text-lg">{movie.overview}</p>
              </div>

              {/* Movie Information */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Movie Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Release Date</h3>
                    <p className="text-gray-400">{formatDate(movie.release_date)}</p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Runtime</h3>
                    <p className="text-gray-400">{formatRuntime(movie.runtime)}</p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Status</h3>
                    <p className="text-gray-400">{movie.status}</p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Original Language</h3>
                    <p className="text-gray-400">{movie.original_language?.toUpperCase()}</p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Budget</h3>
                    <p className="text-gray-400">{formatCurrency(movie.budget)}</p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Revenue</h3>
                    <p className="text-gray-400">{formatCurrency(movie.revenue)}</p>
                  </div>
                </div>
              </div>

              {/* Genres */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Genres</h2>
                <div className="flex flex-wrap gap-3">
                  {movie.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm border border-gray-700 hover:border-red-600 hover:text-red-400 transition-colors"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cast & Crew */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-8">Cast & Crew</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {movie.credits.cast.slice(0, 9).map((actor) => (
                  <div
                    key={actor.id}
                    className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                      {actor.profile_path ? (
                        <Image
                          src={tmdbApi.getImageUrl(actor.profile_path, "PROFILE") || "/placeholder.svg"}
                          alt={actor.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Users className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="text-white min-w-0">
                      <div className="font-semibold truncate">{actor.name}</div>
                      <div className="text-sm text-gray-400 truncate">{actor.character}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Movies */}
          {movie.similar?.results && movie.similar.results.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Similar Movies</h2>
              <MovieGrid movies={movie.similar.results.slice(0, 12)} title="" variant="grid" className="py-0" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

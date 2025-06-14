"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Play, Heart, Star, Users, Calendar, Search, Menu, X, ArrowLeft, ChevronDown } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SuccessToast } from "@/components/ui/success-toast"
import { TrailerSection } from "@/components/movie/trailer-section"
import { TvLogo } from "@/components/ui/tv-logo"
import { tmdbApi } from "@/lib/tmdb"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { MovieDetail } from "@/types/movie"

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const movieId = Number.parseInt(params.id as string)

  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)

  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails()
    }
  }, [movieId])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fetchMovieDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [movieData, videosData] = await Promise.all([
        tmdbApi.getMovieDetails(movieId),
        tmdbApi.getMovieVideos(movieId),
      ])

      setMovie(movieData)

      // Find trailer video
      const trailer = videosData.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube")
      setTrailerKey(trailer?.key || null)
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
    if (added) {
      setShowSuccessToast(true)
    }
    showToast(added ? "Success Add to Favorites" : "Removed from favorites", added ? "success" : "info")
  }

  const handleWatchTrailer = () => {
    if (trailerKey) {
      setShowTrailer(true)
      // Scroll to trailer section
      setTimeout(() => {
        const trailerSection = document.getElementById("trailer-section")
        if (trailerSection) {
          trailerSection.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-400">Loading movie details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black">
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
    <div className="min-h-screen bg-black text-white">
      {/* Success Toast */}
      <SuccessToast
        message="Success Add to Favorites"
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Header - Fixed with scroll behavior */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-black/95 backdrop-blur-md border-b border-gray-800/50" : "bg-transparent",
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - Updated to TV icon */}
            <div className="flex items-center gap-3">
              <TvLogo className="text-white" width={32} height={32} />
              <span className="text-xl md:text-2xl font-bold text-white">Movie</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => router.push("/")}
                className="text-white hover:text-gray-300 transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => router.push("/favorites")}
                className="text-white hover:text-gray-300 transition-colors font-medium"
              >
                Favourites
              </button>
            </nav>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search Movie"
                  className="bg-gray-800/50 text-white pl-10 pr-4 py-2 rounded-full border border-gray-600 focus:outline-none focus:border-gray-400 w-64"
                />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <Search className="w-6 h-6 text-white" />
              <button onClick={() => setShowMobileMenu(true)}>
                <Menu className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-60 md:hidden">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowMobileMenu(false)} />
          <div className="absolute top-0 right-0 w-80 h-full bg-black border-l border-gray-800">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <TvLogo className="text-white" width={32} height={32} />
                <span className="text-xl font-bold text-white">Movie</span>
              </div>
              <button onClick={() => setShowMobileMenu(false)}>
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <nav className="p-6 space-y-6">
              <button
                onClick={() => {
                  router.push("/")
                  setShowMobileMenu(false)
                }}
                className="block text-white hover:text-gray-300 transition-colors font-medium text-lg"
              >
                Home
              </button>
              <button
                onClick={() => {
                  router.push("/favorites")
                  setShowMobileMenu(false)
                }}
                className="block text-white hover:text-gray-300 transition-colors font-medium text-lg"
              >
                Favourites
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Back Button - Mobile Only */}
      <div className="md:hidden fixed top-20 left-4 z-40">
        <button
          onClick={() => router.back()}
          className="bg-black/50 backdrop-blur-sm p-2 rounded-full border border-gray-700"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 h-screen">
          <Image
            src={tmdbApi.getImageUrl(movie.backdrop_path, "original") || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 pt-20 md:pt-24 pb-16 min-h-screen">
          <div className="container mx-auto px-4 md:px-6">
            {/* Movie Content */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start pt-16 md:pt-24">
              {/* Poster */}
              <div className="w-full max-w-[200px] md:max-w-[280px] mx-auto md:mx-0 flex-shrink-0">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl">
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
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{movie.title}</h1>

                {/* Release Date */}
                <div className="flex items-center justify-center md:justify-start gap-2 mb-6 text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg">{formatDate(movie.release_date)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                  {/* Watch Trailer Button - Only show if trailer exists */}
                  {trailerKey && (
                    <button
                      onClick={handleWatchTrailer}
                      className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-3 transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      Watch Trailer
                    </button>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={handleFavoriteClick}
                    className="p-3 rounded-full transition-colors hover:bg-white/10"
                    title={isFavorite(movie.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart
                      className={cn(
                        "w-6 h-6 transition-colors",
                        isFavorite(movie.id) ? "fill-red-500 text-red-500" : "text-white",
                      )}
                    />
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto md:mx-0">
                  <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl text-center border border-gray-800">
                    <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <div className="text-xs text-gray-400 mb-1">Rating</div>
                    <div className="font-bold text-lg">{movie.vote_average.toFixed(1)}/10</div>
                  </div>

                  <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl text-center border border-gray-800">
                    <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-xs text-gray-400 mb-1">Genre</div>
                    <div className="font-bold text-lg">{movie.genres?.[0]?.name || "Action"}</div>
                  </div>

                  <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl text-center border border-gray-800">
                    <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <div className="text-xs text-gray-400 mb-1">Age Limit</div>
                    <div className="font-bold text-lg">{movie.adult ? "18+" : "13"}</div>
                  </div>
                </div>

                {/* Scroll Indicator for Trailer */}
                {trailerKey && showTrailer && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 animate-bounce">
                    <ChevronDown className="w-5 h-5" />
                    <span className="text-sm">Watch trailer below</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Section */}
      {trailerKey && showTrailer && (
        <div id="trailer-section">
          <TrailerSection
            trailerKey={trailerKey}
            movieTitle={movie.title}
            isVisible={showTrailer}
            onClose={() => setShowTrailer(false)}
          />
        </div>
      )}

      {/* Content Sections */}
      <div className="bg-black">
        <div className="container mx-auto px-4 md:px-6 py-12">
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Overview</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{movie.overview}</p>
          </section>

          {/* Cast & Crew */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Cast & Crew</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {movie.credits.cast.slice(0, 6).map((actor) => (
                  <div key={actor.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                      {actor.profile_path ? (
                        <Image
                          src={tmdbApi.getImageUrl(actor.profile_path, "w185") || "/placeholder.svg"}
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
                      <div className="font-semibold text-lg">{actor.name}</div>
                      <div className="text-sm text-gray-400">{actor.character}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

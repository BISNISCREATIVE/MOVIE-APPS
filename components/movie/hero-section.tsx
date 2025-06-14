"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Play, Info } from "lucide-react"
import { tmdbApi } from "@/lib/tmdb"
import type { Movie } from "@/types/movie"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      try {
        const response = await tmdbApi.getTrending()
        if (response.results && response.results.length > 0) {
          setFeaturedMovie(response.results[0])
        }
      } catch (error) {
        console.error("Error fetching featured movie:", error)
      }
    }

    fetchFeaturedMovie()
  }, [])

  const handleSeeDetail = () => {
    if (featuredMovie) {
      router.push(`/movie/${featuredMovie.id}`)
    }
  }

  const handleWatchTrailer = () => {
    if (featuredMovie) {
      router.push(`/movie/${featuredMovie.id}`)
    }
  }

  if (!featuredMovie) {
    return (
      <div className="relative h-[60vh] bg-gray-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>
    )
  }

  return (
    <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
      <Image
        src={tmdbApi.getImageUrl(featuredMovie.backdrop_path, "original") || "/placeholder.svg"}
        alt={featuredMovie.title}
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{featuredMovie.title}</h1>

          <p className="text-gray-200 text-sm md:text-base max-w-2xl mb-6 line-clamp-3">{featuredMovie.overview}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleWatchTrailer}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-5 h-5" />
              Watch Trailer
            </button>

            <button
              onClick={handleSeeDetail}
              className="bg-transparent border border-white text-white hover:bg-white hover:text-black px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Info className="w-5 h-5" />
              See Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

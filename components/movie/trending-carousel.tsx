"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"
import { MovieCard } from "./movie-card"
import { cn } from "@/lib/utils"
import type { Movie } from "@/types/movie"

interface TrendingCarouselProps {
  movies: Movie[]
  className?: string
}

export function TrendingCarousel({ movies, className }: TrendingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [itemsPerView, setItemsPerView] = useState(6)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout>()

  // Calculate items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth
      if (width < 640) {
        setItemsPerView(2.2) // Mobile: 2.2 items (partial view)
      } else if (width < 768) {
        setItemsPerView(3.5) // Small tablet: 3.5 items
      } else if (width < 1024) {
        setItemsPerView(4.5) // Tablet: 4.5 items
      } else if (width < 1280) {
        setItemsPerView(5.5) // Desktop: 5.5 items
      } else {
        setItemsPerView(6.5) // Large desktop: 6.5 items
      }
    }

    updateItemsPerView()
    window.addEventListener("resize", updateItemsPerView)
    return () => window.removeEventListener("resize", updateItemsPerView)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && movies.length > itemsPerView) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const maxIndex = Math.max(0, movies.length - Math.floor(itemsPerView))
          const nextIndex = prevIndex >= maxIndex ? 0 : prevIndex + 1
          scrollToIndex(nextIndex)
          return nextIndex
        })
      }, 4000) // Auto-advance every 4 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, movies.length, itemsPerView])

  // Update scroll buttons state
  useEffect(() => {
    const maxIndex = Math.max(0, movies.length - Math.floor(itemsPerView))
    setCanScrollLeft(currentIndex > 0)
    setCanScrollRight(currentIndex < maxIndex)
  }, [currentIndex, movies.length, itemsPerView])

  const scrollLeft = () => {
    setIsAutoPlaying(false) // Stop auto-play when user interacts
    if (canScrollLeft) {
      const newIndex = Math.max(0, currentIndex - 1)
      setCurrentIndex(newIndex)
      scrollToIndex(newIndex)
    }
  }

  const scrollRight = () => {
    setIsAutoPlaying(false) // Stop auto-play when user interacts
    const maxIndex = Math.max(0, movies.length - Math.floor(itemsPerView))
    if (canScrollRight) {
      const newIndex = Math.min(maxIndex, currentIndex + 1)
      setCurrentIndex(newIndex)
      scrollToIndex(newIndex)
    }
  }

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const itemWidth = 160 + 16 // 160px width + 16px gap (w-40 + gap-4)
      const scrollPosition = index * itemWidth

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }

  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

  if (movies.length === 0) {
    return null
  }

  return (
    <section className={cn("py-8", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Trending Now</h2>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Live trending</span>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {/* Left Arrow - Frame Position */}
          <div
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-20 transition-all duration-300",
              canScrollLeft ? "opacity-0 group-hover:opacity-100" : "opacity-0",
            )}
            style={{ left: "-20px" }}
          >
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className="p-4 rounded-full bg-black/90 hover:bg-red-600 text-white transition-all duration-200 hover:scale-110 shadow-2xl border-2 border-gray-700 hover:border-red-500 backdrop-blur-sm"
              aria-label="Previous trending movies"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          {/* Right Arrow - Frame Position */}
          <div
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-20 transition-all duration-300",
              canScrollRight ? "opacity-0 group-hover:opacity-100" : "opacity-0",
            )}
            style={{ right: "-20px" }}
          >
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className="p-4 rounded-full bg-black/90 hover:bg-red-600 text-white transition-all duration-200 hover:scale-110 shadow-2xl border-2 border-gray-700 hover:border-red-500 backdrop-blur-sm"
              aria-label="Next trending movies"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Movies Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {movies.slice(0, 20).map((movie, index) => (
              <div key={`trending-${movie.id}-${index}`} className="relative flex-shrink-0 w-32 md:w-40">
                {/* Trending Rank Badge */}
                <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg border border-red-400">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>#{index + 1}</span>
                  </div>
                </div>

                {/* Hot Badge for Top 3 */}
                {index < 3 && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg animate-pulse">
                    🔥
                  </div>
                )}

                <MovieCard movie={movie} variant="carousel" />
              </div>
            ))}
          </div>

          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black via-black/50 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black via-black/50 to-transparent pointer-events-none z-10" />
        </div>

        {/* Progress Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(movies.length / Math.floor(itemsPerView)) }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false)
                const newIndex = index * Math.floor(itemsPerView)
                setCurrentIndex(newIndex)
                scrollToIndex(newIndex)
              }}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                Math.floor(currentIndex / Math.floor(itemsPerView)) === index
                  ? "bg-red-600 w-8"
                  : "bg-gray-600 hover:bg-gray-500 w-4",
              )}
              aria-label={`Go to trending page ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play Status */}
        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>
              Showing {currentIndex + 1}-{Math.min(currentIndex + Math.floor(itemsPerView), movies.length)} of{" "}
              {movies.length} trending
            </span>
            <div className="flex items-center gap-1">
              <div
                className={cn("w-2 h-2 rounded-full", isAutoPlaying ? "bg-green-500 animate-pulse" : "bg-gray-500")}
              />
              <span>{isAutoPlaying ? "Auto-playing" : "Paused"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

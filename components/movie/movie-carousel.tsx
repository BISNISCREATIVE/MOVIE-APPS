"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MovieCard } from "./movie-card"
import { cn } from "@/lib/utils"
import type { Movie } from "@/types/movie"

interface MovieCarouselProps {
  movies: Movie[]
  title: string
  className?: string
}

export function MovieCarousel({ movies, title, className }: MovieCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [itemsPerView, setItemsPerView] = useState(6)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Calculate items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth
      if (width < 640) {
        setItemsPerView(2) // Mobile: 2 items
      } else if (width < 768) {
        setItemsPerView(3) // Small tablet: 3 items
      } else if (width < 1024) {
        setItemsPerView(4) // Tablet: 4 items
      } else if (width < 1280) {
        setItemsPerView(5) // Desktop: 5 items
      } else {
        setItemsPerView(6) // Large desktop: 6 items
      }
    }

    updateItemsPerView()
    window.addEventListener("resize", updateItemsPerView)
    return () => window.removeEventListener("resize", updateItemsPerView)
  }, [])

  // Update scroll buttons state
  useEffect(() => {
    const maxIndex = Math.max(0, movies.length - itemsPerView)
    setCanScrollLeft(currentIndex > 0)
    setCanScrollRight(currentIndex < maxIndex)
  }, [currentIndex, movies.length, itemsPerView])

  const scrollLeft = () => {
    if (canScrollLeft) {
      const newIndex = Math.max(0, currentIndex - 1)
      setCurrentIndex(newIndex)
      scrollToIndex(newIndex)
    }
  }

  const scrollRight = () => {
    const maxIndex = Math.max(0, movies.length - itemsPerView)
    if (canScrollRight) {
      const newIndex = Math.min(maxIndex, currentIndex + 1)
      setCurrentIndex(newIndex)
      scrollToIndex(newIndex)
    }
  }

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const itemWidth = container.scrollWidth / movies.length
      const scrollPosition = index * itemWidth

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }

  if (movies.length === 0) {
    return null
  }

  return (
    <section className={cn("py-8", className)}>
      <div className="container mx-auto px-4">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{movies.length} movies</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                canScrollLeft
                  ? "bg-gray-800 hover:bg-gray-700 text-white hover:scale-110"
                  : "bg-gray-900 text-gray-600 cursor-not-allowed",
              )}
              aria-label="Previous movies"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                canScrollRight
                  ? "bg-gray-800 hover:bg-gray-700 text-white hover:scale-110"
                  : "bg-gray-900 text-gray-600 cursor-not-allowed",
              )}
              aria-label="Next movies"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Left Navigation Overlay */}
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 z-10 flex items-center pl-2 transition-opacity duration-200",
              canScrollLeft ? "opacity-0 group-hover:opacity-100" : "opacity-0",
            )}
          >
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className="p-3 rounded-full bg-black/80 hover:bg-black text-white transition-all duration-200 hover:scale-110 shadow-lg"
              aria-label="Previous movies"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          {/* Right Navigation Overlay */}
          <div
            className={cn(
              "absolute right-0 top-0 bottom-0 z-10 flex items-center pr-2 transition-opacity duration-200",
              canScrollRight ? "opacity-0 group-hover:opacity-100" : "opacity-0",
            )}
          >
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className="p-3 rounded-full bg-black/80 hover:bg-black text-white transition-all duration-200 hover:scale-110 shadow-lg"
              aria-label="Next movies"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Movies Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {movies.map((movie, index) => (
              <div key={`${movie.id}-${index}`} className="relative flex-shrink-0 w-32 md:w-40">
                {/* Ranking Badge */}
                <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
                  #{index + 1}
                </div>
                <MovieCard movie={movie} variant="carousel" />
              </div>
            ))}
          </div>

          {/* Gradient Overlays for Visual Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none z-5" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none z-5" />
        </div>

        {/* Carousel Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(movies.length / itemsPerView) }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                scrollToIndex(index)
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                Math.floor(currentIndex / itemsPerView) === index ? "bg-red-600 w-6" : "bg-gray-600 hover:bg-gray-500",
              )}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

        {/* Keyboard Navigation Hint */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Use arrow keys or swipe to navigate • {currentIndex + 1}-
            {Math.min(currentIndex + itemsPerView, movies.length)} of {movies.length}
          </p>
        </div>
      </div>
    </section>
  )
}

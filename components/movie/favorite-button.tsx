"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { SuccessToast } from "@/components/ui/success-toast"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Movie } from "@/types/movie"

interface FavoriteButtonProps {
  movie: Movie
  className?: string
  size?: "sm" | "md" | "lg"
}

export function FavoriteButton({ movie, className, size = "md" }: FavoriteButtonProps) {
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()

  const handleClick = () => {
    const added = toggleFavorite(movie)
    if (added) {
      setShowSuccessToast(true)
    }
    showToast(added ? "Success Add to Favorites" : "Removed from favorites", added ? "success" : "info")
  }

  const sizeClasses = {
    sm: "p-2 w-8 h-8",
    md: "p-3 w-12 h-12",
    lg: "p-4 w-16 h-16",
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  return (
    <>
      <SuccessToast
        message="Success Add to Favorites"
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />

      <button
        onClick={handleClick}
        className={cn(
          "rounded-full transition-colors border-2 border-gray-600 hover:border-red-600 flex items-center justify-center",
          sizeClasses[size],
          className,
        )}
      >
        <Heart
          className={cn(
            "transition-colors",
            iconSizes[size],
            isFavorite(movie.id) ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-red-500",
          )}
        />
      </button>
    </>
  )
}

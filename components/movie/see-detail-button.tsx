"use client"

import { useRouter } from "next/navigation"
import { Info } from "lucide-react"
import type { Movie } from "@/types/movie"

interface SeeDetailButtonProps {
  movie: Movie
  variant?: "primary" | "secondary"
  className?: string
}

export function SeeDetailButton({ movie, variant = "secondary", className }: SeeDetailButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/movie/${movie.id}`)
  }

  if (variant === "primary") {
    return (
      <button
        onClick={handleClick}
        className={`bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-colors ${className}`}
      >
        <Info className="w-5 h-5" />
        See Detail
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`bg-transparent border border-white text-white hover:bg-white hover:text-black px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-colors ${className}`}
    >
      <Info className="w-5 h-5" />
      See Detail
    </button>
  )
}

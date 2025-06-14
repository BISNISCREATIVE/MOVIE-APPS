"use client"

import { useState } from "react"
import { X, Maximize, Minimize } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrailerPlayerProps {
  trailerKey: string
  movieTitle: string
  isOpen: boolean
  onClose: () => void
}

export function TrailerPlayer({ trailerKey, movieTitle, isOpen, onClose }: TrailerPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!isOpen) return null

  const embedUrl = `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&showinfo=0`

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Watch Trailer</h3>
            <p className="text-gray-400">{movieTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Player */}
        <div className={cn("relative bg-black rounded-xl overflow-hidden", isFullscreen ? "fixed inset-4 z-50" : "")}>
          <div className="relative aspect-video">
            <iframe
              src={embedUrl}
              title={`${movieTitle} Trailer`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Custom Controls Overlay */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Enjoying the trailer? Don't forget to add this movie to your favorites!
          </p>
        </div>
      </div>
    </div>
  )
}

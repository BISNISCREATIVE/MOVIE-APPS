"use client"

import { useState } from "react"
import { X, ExternalLink, Share2, Maximize, Minimize, Volume2, VolumeX } from "lucide-react"

interface TrailerSectionProps {
  trailerKey: string | null
  movieTitle: string
  isVisible: boolean
  onClose: () => void
}

export function TrailerSection({ trailerKey, movieTitle, isVisible, onClose }: TrailerSectionProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  if (!isVisible || !trailerKey) return null

  const embedUrl = `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1${
    isMuted ? "&mute=1" : ""
  }`
  const youtubeUrl = `https://www.youtube.com/watch?v=${trailerKey}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${movieTitle} - Official Trailer`,
          url: youtubeUrl,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(youtubeUrl)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="bg-gradient-to-b from-black to-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">Official Trailer</h3>
            <p className="text-gray-400 text-lg">{movieTitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              title="Share trailer"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              title="Open in YouTube"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              title="Close trailer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className={`relative ${isFullscreen ? "fixed inset-4 z-50 bg-black" : "max-w-6xl mx-auto"}`}>
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white">Loading trailer...</p>
                </div>
              </div>
            )}

            {/* YouTube Embed */}
            <iframe
              src={embedUrl}
              title={`${movieTitle} Official Trailer`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
            />

            {/* Custom Controls Overlay */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-black/70 hover:bg-black/90 text-white transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>

            {/* Gradient Overlay for better integration */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Video Info */}
          {!isFullscreen && (
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                <span>• Official Trailer</span>
                <span>• HD Quality</span>
                <span>• YouTube</span>
                <span>• {new Date().getFullYear()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isFullscreen && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-3 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              Watch on YouTube
            </a>
            <button
              onClick={handleShare}
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-3 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Share Trailer
            </button>
          </div>
        )}

        {/* Close Button */}
        {!isFullscreen && (
          <div className="text-center mt-8">
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-sm underline">
              Close Trailer Player
            </button>
          </div>
        )}

        {/* Fullscreen Close Button */}
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="fixed top-4 right-4 z-60 p-3 rounded-full bg-black/70 hover:bg-black/90 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  )
}

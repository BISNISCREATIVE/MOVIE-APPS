"use client"

import { AlertCircle, ExternalLink, Film } from "lucide-react"

interface NoTrailerIndicatorProps {
  movieTitle: string
  className?: string
}

export function NoTrailerIndicator({ movieTitle, className }: NoTrailerIndicatorProps) {
  const handleSearchTrailer = () => {
    const searchQuery = encodeURIComponent(`${movieTitle} trailer`)
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, "_blank")
  }

  return (
    <div
      className={`bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 lg:p-12 text-center max-w-2xl mx-auto ${className}`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Icon */}
        <div className="relative">
          <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-700/50">
            <Film className="w-10 h-10 text-gray-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white">No Trailer Available</h3>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Unfortunately, we don't have a trailer for <span className="text-white font-medium">"{movieTitle}"</span> at
            the moment.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={handleSearchTrailer}
            className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50"
          >
            <ExternalLink className="w-5 h-5" />
            Search on YouTube
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
          Trailers are usually added closer to the release date. Check back later for updates!
        </p>
      </div>
    </div>
  )
}

"use client"

import { Film, ExternalLink } from "lucide-react"

interface NoTrailerStateProps {
  movieTitle: string
  movieId: number
}

export function NoTrailerState({ movieTitle, movieId }: NoTrailerStateProps) {
  const handleSearchTrailer = () => {
    const searchQuery = encodeURIComponent(`${movieTitle} trailer`)
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, "_blank")
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        {/* Icon */}
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
          <Film className="w-8 h-8 text-gray-400" />
        </div>

        {/* Message */}
        <div>
          <h3 className="text-xl font-bold text-white mb-2">No Trailer Available</h3>
          <p className="text-gray-400 mb-6">Unfortunately, we don't have a trailer for "{movieTitle}" at the moment.</p>
        </div>

        {/* Alternative Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSearchTrailer}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Search on YouTube
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-4">
          Trailers are usually added closer to the release date. Check back later!
        </p>
      </div>
    </div>
  )
}

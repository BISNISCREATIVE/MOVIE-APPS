"use client"

import Link from "next/link"
import { EmptyStateIcon } from "@/components/ui/empty-state-icon"

export function FavoritesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Updated Empty State Icon */}
      <div className="mb-8">
        <EmptyStateIcon width={240} height={240} />
      </div>

      {/* Empty State Content */}
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Data Empty</h2>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">You don't have a favorite movie yet</p>

        {/* Explore Movies Button */}
        <Link
          href="/"
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors inline-block"
        >
          Explore Movie
        </Link>
      </div>

      {/* Additional Help Text */}
      <div className="mt-12 max-w-lg mx-auto">
        <p className="text-gray-500 text-sm leading-relaxed">
          Start exploring movies and click the heart icon to add them to your favorites. Your favorite movies will
          appear here for easy access anytime.
        </p>
      </div>
    </div>
  )
}

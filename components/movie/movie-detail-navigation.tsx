"use client"

import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MovieDetailNavigationProps {
  movieId: number
}

export function MovieDetailNavigation({ movieId }: MovieDetailNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { id: "detail", label: "Movie Detail", path: `/movie/${movieId}` },
    { id: "overview", label: "Overview", path: `/movie/${movieId}/overview` },
  ]

  return (
    <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-16 z-30">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className={cn(
                "py-4 px-2 border-b-2 font-medium text-sm transition-colors",
                pathname === tab.path
                  ? "border-red-600 text-red-400"
                  : "border-transparent text-gray-400 hover:text-white hover:border-gray-600",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Film, Search } from "lucide-react"
import { Navigation } from "./navigation"
import { SearchBar } from "./search-bar"

interface MobileHeaderProps {
  onSearch?: (query: string) => void
  onClearSearch?: () => void
}

export function MobileHeader({ onSearch, onClearSearch }: MobileHeaderProps) {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <header className="md:hidden sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
              <Film className="w-5 h-5 text-black" />
            </div>
            <span className="text-white font-bold text-xl">Movie</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onSearch && (
              <button onClick={() => setShowSearch(!showSearch)} className="p-2 text-white hover:text-gray-300">
                <Search className="w-6 h-6" />
              </button>
            )}
            <Navigation />
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && onSearch && onClearSearch && (
          <div className="pb-4">
            <SearchBar
              onSearch={(query) => {
                onSearch(query)
                setShowSearch(false)
              }}
              onClear={() => {
                onClearSearch()
                setShowSearch(false)
              }}
              className="w-full"
              placeholder="Search movies..."
            />
          </div>
        )}
      </div>
    </header>
  )
}

"use client"
import Link from "next/link"
import { TvLogo } from "@/components/ui/tv-logo"
import { Navigation } from "./navigation"
import { SearchBar } from "./search-bar"

interface HeaderProps {
  onSearch?: (query: string) => void
  onClearSearch?: () => void
}

export function Header({ onSearch, onClearSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Updated to TV icon */}
          <Link
            href="/"
            className="flex items-center gap-3 text-white hover:text-red-400 transition-colors duration-200"
          >
            <div className="relative">
              {/* TV Logo - Custom SVG */}
              <TvLogo className="text-white" width={32} height={32} />
            </div>
            <span className="text-2xl font-bold tracking-wide">Movie</span>
          </Link>

          {/* Navigation */}
          <Navigation />

          {/* Search Bar - Desktop Only */}
          {onSearch && onClearSearch && (
            <div className="hidden md:block">
              <SearchBar onSearch={onSearch} onClear={onClearSearch} className="w-72" />
            </div>
          )}
        </div>

        {/* Mobile Search Bar */}
        {onSearch && onClearSearch && (
          <div className="md:hidden pb-4">
            <SearchBar onSearch={onSearch} onClear={onClearSearch} className="w-full" />
          </div>
        )}
      </div>
    </header>
  )
}

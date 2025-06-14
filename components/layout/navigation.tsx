"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film, Home, Heart, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/favorites", label: "Favorites", icon: Heart },
]

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                isActive ? "text-white bg-red-600/20" : "text-gray-300 hover:text-white hover:bg-gray-800",
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Mobile Menu Button */}
      <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2">
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-50 md:hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-2 text-xl font-bold text-white">
                <Film className="w-8 h-8" />
                Movie
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex flex-col p-4">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-4 rounded-lg text-lg transition-colors",
                      isActive ? "text-white bg-red-600/20" : "text-gray-300 hover:text-white hover:bg-gray-800",
                    )}
                  >
                    <Icon className="w-6 h-6" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

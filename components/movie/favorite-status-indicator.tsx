"use client"

import { Heart, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface FavoriteStatusIndicatorProps {
  isFavorite: boolean
  className?: string
}

export function FavoriteStatusIndicator({ isFavorite, className }: FavoriteStatusIndicatorProps) {
  if (!isFavorite) return null

  return (
    <div className={cn("flex items-center gap-2 text-red-400", className)}>
      <div className="flex items-center gap-1">
        <Heart className="w-4 h-4 fill-current" />
        <Check className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium">Added to your favorites</span>
    </div>
  )
}

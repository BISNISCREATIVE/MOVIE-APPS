"use client"

import { useEffect, useState } from "react"
import { CheckCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SuccessToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function SuccessToast({ message, isVisible, onClose, duration = 3000 }: SuccessToastProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!shouldRender) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={cn(
          "flex items-center gap-3 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg min-w-[300px] transition-all duration-300 transform",
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95",
        )}
      >
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1 font-medium">{message}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

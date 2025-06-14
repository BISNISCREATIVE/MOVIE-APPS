import { TvLogo } from "@/components/ui/tv-logo"

export function Footer() {
  return (
    <footer className="bg-black text-white py-8 mt-16 border-t border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo - Updated to TV icon */}
          <div className="flex items-center gap-3">
            <TvLogo className="text-white" width={32} height={32} />
            <span className="font-bold text-xl text-white">Movie</span>
          </div>

          {/* Copyright */}
          <p className="text-gray-400 text-sm">Copyright ©2025 Movie Explorer</p>
        </div>
      </div>
    </footer>
  )
}

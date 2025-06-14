import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/layout/footer"
import { ToastContainer } from "@/components/ui/toast"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { ScrollToTop } from "@/components/ui/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Movie Explorer - Discover Amazing Movies",
  description:
    "Explore trending movies, discover new releases, and build your personal favorites collection with Movie Explorer.",
  keywords: ["movies", "cinema", "entertainment", "TMDB", "film"],
  authors: [{ name: "Movie Explorer Team" }],
  openGraph: {
    title: "Movie Explorer",
    description: "Discover and explore amazing movies",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ToastContainer />
          <ScrollToTop />
        </ErrorBoundary>
      </body>
    </html>
  )
}

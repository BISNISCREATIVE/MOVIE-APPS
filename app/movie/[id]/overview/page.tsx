"use client"

import { useParams } from "next/navigation"
import { MovieOverviewPage } from "@/components/movie/movie-overview-page"

export default function MovieOverview() {
  const params = useParams()
  const movieId = Number.parseInt(params.id as string)

  return <MovieOverviewPage movieId={movieId} />
}

export const TMDB_CONFIG = {
  API_KEY: "27158b49b8943955f2815b7b99e0a678",
  ACCESS_TOKEN:
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNzE1OGI0OWI4OTQzOTU1ZjI4MTViN2I5OWUwYTY3OCIsIm5iZiI6MTc0OTcwOTE1MC44MDksInN1YiI6IjY4NGE3MTVlZjZlZDExNzg0MjM0Mzc2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QlnOilr_89KQE6HpxV611Jz_h0tRXgk64GT7I2LNQJ4",
  BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
} as const

export const IMAGE_SIZES = {
  POSTER: "w500",
  BACKDROP: "w1280",
  PROFILE: "w185",
  ORIGINAL: "original",
} as const

export const ROUTES = {
  HOME: "/",
  FAVORITES: "/favorites",
  MOVIE_DETAIL: "/movie",
} as const

import { useState, useEffect, useCallback } from 'react'
import { movieService, type MovieQueryParams } from '@/services/content/movieService'
import type { Movie, MovieDetail } from '@/services/content/movieService'
import { getUserFriendlyErrorMessage } from '@/core/api/utils/errors'

export const useMovies = (params?: MovieQueryParams) => {
	const [movies, setMovies] = useState<Movie[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
		itemsPerPage: 16
	})

	const fetchMovies = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			const response = await movieService.getMovies(params)
			// Map thumbnail to image for ContentCard compatibility
			const moviesWithImage = response.movies.map(movie => ({
				...movie,
				image: movie.thumbnailUrl || movie.thumbnailUrl || '',
				type: movie.genres?.join(', ') || 'Movie',
				season: movie.releaseYear?.toString() || '',
				reviews: movie.totalRatings || 0,
				watching: movie.viewCount || 0,
				episodes: movie.duration ? Math.floor(movie.duration / 60) : 0 // Duration in minutes
			}))
			setMovies(moviesWithImage as any)
			setPagination({
				currentPage: response.pagination.page,
				totalPages: response.pagination.totalPages,
				totalItems: response.pagination.total,
				itemsPerPage: response.pagination.limit
			})
		} catch (err) {
			const message = getUserFriendlyErrorMessage(err)
			setError(message)
		} finally {
			setLoading(false)
		}
	}, [params])

	useEffect(() => {
		fetchMovies()
	}, [fetchMovies])

	return {
		movies,
		loading,
		error,
		pagination,
		refetch: fetchMovies
	}
}

export const useMovieDetail = (id: string) => {
	const [movie, setMovie] = useState<MovieDetail | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchMovie = async () => {
			if (!id) return

			try {
				setLoading(true)
				setError(null)
				const data = await movieService.getMovieById(id)
				setMovie(data)
			} catch (err) {
				const message = getUserFriendlyErrorMessage(err)
				setError(message)
			} finally {
				setLoading(false)
			}
		}

		fetchMovie()
	}, [id])

	return { movie, loading, error }
}

export const useTrendingMovies = (limit: number = 16) => {
	const [movies, setMovies] = useState<Movie[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				setLoading(true)
				setError(null)
				const data = await movieService.getTrendingMovies(limit)
				setMovies(data)
			} catch (err) {
				const message = getUserFriendlyErrorMessage(err)
				setError(message)
			} finally {
				setLoading(false)
			}
		}

		fetchMovies()
	}, [limit])

	return { movies, loading, error }
}

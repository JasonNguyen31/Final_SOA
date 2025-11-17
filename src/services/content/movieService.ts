import axios from 'axios'
import { BACKEND_CONFIG } from '@/config/backend.config'
import { storageService } from '@/core/storage/storageService'
import type { ContentCard } from '@/types/content.types'
import { errorInterceptor } from '@/core/api/interceptors/error.interceptor'

// Create axios instance for movie service
const movieApiClient = axios.create({
	baseURL: BACKEND_CONFIG.MOVIE_SERVICE.BASE_URL,
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
})

// Add auth token to requests
movieApiClient.interceptors.request.use((config) => {
	const token = storageService.getToken()
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

// Add error interceptor
movieApiClient.interceptors.response.use(
	errorInterceptor.onResponse,
	errorInterceptor.onResponseError
)

// Types
export interface Movie extends Omit<ContentCard, 'id'> {
	totalRatings: number
	viewCount: number
	id: string
	description?: string
	videoUrl?: string
	thumbnailUrl?: string
	bannerUrl?: string
	director?: string
	cast?: string[]
	genres?: string[]
	isPremium?: boolean
	isFeatured?: boolean
	duration?: number
	releaseYear?: number
}

export interface MovieDetail extends Movie {
	totalRatings: number
	description: string
	videoUrl: string
	thumbnailUrl: string
	bannerUrl?: string
	director: string
	cast: string[]
	genres: string[]
	country?: string
	language?: string
	totalViews: number
	totalComments: number
}

export interface MovieQueryParams {
	page?: number
	limit?: number
	genre?: string
	year?: number
	search?: string
	isPremium?: boolean
	isFeatured?: boolean
	sortBy?: 'viewCount' | 'rating' | 'releaseYear'
	order?: 'asc' | 'desc'
	type?: string
}

export interface PaginatedMovies {
	movies: Movie[]
	pagination: {
		total: number
		page: number
		limit: number
		totalPages: number
	}
}

export interface WatchProgress {
	movieId: string
	currentTime: number
	duration: number
	percentage: number
	isCompleted: boolean
	lastWatchedAt: string
}

/**
 * Movie Service
 * Handles all movie-related API calls
 */
class MovieService {
	private baseUrl = '/api/movies'

	/**
	 * Get paginated list of movies
	 */
	async getMovies(params?: MovieQueryParams): Promise<PaginatedMovies> {
		const response = await movieApiClient.get<{success: boolean, data: PaginatedMovies}>(this.baseUrl, { params })
		return response.data.data
	}

	/**
	 * Get movie by ID
	 */
	async getMovieById(id: string): Promise<MovieDetail> {
		const response = await movieApiClient.get<{success: boolean, data: MovieDetail}>(`${this.baseUrl}/${id}`)
		return response.data.data
	}

	/**
	 * Get featured movies
	 */
	async getFeaturedMovies(limit: number = 10): Promise<Movie[]> {
		const response = await movieApiClient.get<{success: boolean, data: Movie[]}>(`${this.baseUrl}/featured`, {
			params: { limit }
		})
		return response.data.data
	}

	/**
	 * Get trending movies
	 */
	async getTrendingMovies(limit: number = 16): Promise<Movie[]> {
		const response = await movieApiClient.get<{success: boolean, data: {movies: Movie[]}}>(`${this.baseUrl}/trending`, {
			params: { limit }
		})
		return response.data.data.movies
	}

	/**
	 * Get movies by genre
	 */
	async getMoviesByGenre(genre: string, params?: MovieQueryParams): Promise<PaginatedMovies> {
		const response = await movieApiClient.get<{success: boolean, data: PaginatedMovies}>(`${this.baseUrl}/genre/${genre}`, { params })
		return response.data.data
	}


	/**
	 * Get user's watch history
	 */
	async getWatchHistory(): Promise<WatchProgress[]> {
		const response = await movieApiClient.get<{success: boolean, data: WatchProgress[]}>(`${this.baseUrl}/watch-history`)
		return response.data.data
	}

	/**
	 * Get continue watching movies (progress > 0% and < 90%)
	 */
	async getContinueWatching(): Promise<Movie[]> {
		const response = await movieApiClient.get<{success: boolean, data: {movies: Movie[]}}>(`${this.baseUrl}/continue-watching`)
		return response.data.data.movies || []
	}

	/**
	 * Get watch progress for a movie
	 */
	async getWatchProgress(movieId: string): Promise<WatchProgress | null> {
		const response = await movieApiClient.get<{success: boolean, data: WatchProgress | null}>(`${this.baseUrl}/${movieId}/progress`)
		return response.data.data
	}

	/**
	 * Update watch progress
	 */
	async updateWatchProgress(
		movieId: string,
		progress: { currentTime: number; duration: number }
	): Promise<WatchProgress> {
		const response = await movieApiClient.put<{success: boolean, data: WatchProgress}>(`${this.baseUrl}/${movieId}/progress`, {
			watchedSeconds: Math.floor(progress.currentTime),
			totalSeconds: Math.floor(progress.duration)
		})
		return response.data.data
	}

	/**
	 * Mark movie as watched
	 */
	async markAsWatched(movieId: string): Promise<void> {
		await movieApiClient.post(`${this.baseUrl}/${movieId}/watched`)
	}

	/**
	 * Get recommended movies (authenticated users)
	 */
	async getRecommendedMovies(limit: number = 10): Promise<Movie[]> {
		try {
			const response = await movieApiClient.get<{success: boolean, data: Movie[]}>(`${this.baseUrl}/recommended`, {
				params: { limit }
			})
			console.log('Recommended movies response:', response.data)
			return response.data.data || []
		} catch (error) {
			console.error('Error fetching recommended movies:', error)
			throw error
		}
	}

	/**
	 * Get random movies (guest users)
	 */
	async getRandomMovies(limit: number = 5): Promise<Movie[]> {
		try {
			const response = await movieApiClient.get<{success: boolean, data: Movie[]}>(`${this.baseUrl}/random`, {
				params: { limit }
			})
			console.log('Random movies response:', response.data)
			return response.data.data || []
		} catch (error) {
			console.error('Error fetching random movies:', error)
			throw error
		}
	}

	/**
	 * Get related movies
	 */
	async getRelatedMovies(movieId: string, limit: number = 6): Promise<Movie[]> {
		const response = await movieApiClient.get<{success: boolean, data: Movie[]}>(`${this.baseUrl}/${movieId}/related`, {
			params: { limit }
		})
		return response.data.data
	}

	/**
	 * Get movie of the week (most viewed this week)
	 */
	async getMovieOfTheWeek(): Promise<Movie> {
		const response = await movieApiClient.get<{success: boolean, data: Movie}>(`${this.baseUrl}/special/movie-of-week`)
		return response.data.data
	}

	/**
	 * Get all unique genres
	 */
	async getGenres(): Promise<string[]> {
		const response = await movieApiClient.get<{success: boolean, data: string[]}>(`${this.baseUrl}/genres`)
		return response.data.data
	}

	/**
	 * Search movies by query
	 */
	async searchMovies(query: string, page: number = 1, limit: number = 5): Promise<PaginatedMovies> {
		const response = await movieApiClient.get<{success: boolean, data: {movies: Movie[], pagination: {total: number, page: number, limit: number}}}>(`${this.baseUrl}/search`, {
			params: { q: query, page, limit }
		})

		return {
			movies: response.data.data.movies || [],
			pagination: {
				total: response.data.data.pagination.total || 0,
				page: response.data.data.pagination.page || page,
				limit: response.data.data.pagination.limit || limit,
				totalPages: Math.ceil((response.data.data.pagination.total || 0) / (response.data.data.pagination.limit || limit))
			}
		}
	}

	// Admin methods
	/**
	 * Create movie (admin only)
	 */
	async createMovie(data: Partial<Movie>): Promise<MovieDetail> {
		const response = await movieApiClient.post<{success: boolean, data: MovieDetail}>(`${this.baseUrl}`, data)
		return response.data.data
	}

	/**
	 * Update movie (admin only)
	 */
	async updateMovie(id: string, data: Partial<Movie>): Promise<MovieDetail> {
		const response = await movieApiClient.put<{success: boolean, data: MovieDetail}>(`${this.baseUrl}/${id}`, data)
		return response.data.data
	}

	/**
	 * Delete movie (admin only)
	 */
	async deleteMovie(id: string): Promise<void> {
		await movieApiClient.delete(`${this.baseUrl}/${id}`)
	}
}

// Export singleton instance
export const movieService = new MovieService()

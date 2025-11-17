/**
 * Backend API Configuration
 * Configures the URLs for all microservices
 */

// Get base URL from environment or default to localhost
const getBackendUrl = (port: number, path: string = '') => {
	const host = import.meta.env.VITE_BACKEND_HOST || 'http://localhost'
	return `${host}:${port}${path}`
}

export const BACKEND_CONFIG = {
	// Auth Service (Port 8001)
	AUTH_SERVICE: {
		BASE_URL: getBackendUrl(8001),
		ENDPOINTS: {
			REGISTER: '/api/auth/register',
			VERIFY_OTP: '/api/auth/verify-otp',
			LOGIN: '/api/auth/login',
			REFRESH: '/api/auth/refresh',
			LOGOUT: '/api/auth/logout',
			FORGOT_PASSWORD: '/api/auth/forgot-password',
			RESET_PASSWORD: '/api/auth/reset-password',
			HEALTH: '/health',
		},
	},

	// User Service (Port 8002)
	USER_SERVICE: {
		BASE_URL: getBackendUrl(8002),
		ENDPOINTS: {
			PROFILE: '/api/users/profile',
			UPDATE_PROFILE: '/api/users/profile',
			CHANGE_PASSWORD: '/api/users/change-password',
			NOTIFICATIONS: '/api/users/notifications',
			WALLET: '/api/users/wallet',
			VIEW_HISTORY: '/api/users/view-history',
		},
	},

	// Movie Service (Port 8003)
	MOVIE_SERVICE: {
		BASE_URL: getBackendUrl(8003),
		ENDPOINTS: {
			LIST: '/api/movies',
			SEARCH: '/api/movies/search',
			GET: (id: string) => `/api/movies/${id}`,
			WATCH: (id: string) => `/api/movies/${id}/watch`,
			PROGRESS: (id: string) => `/api/movies/${id}/progress`,
			RATE: (id: string) => `/api/movies/${id}/rate`,
			TRENDING: '/api/movies/trending',
			CONTINUE_WATCHING: '/api/movies/continue-watching',
			COMMENTS: '/api/comments',
			DELETE_COMMENT: (id: string) => `/api/comments/${id}`,
			REPORT_COMMENT: (id: string) => `/api/comments/${id}/report`,
		},
	},

	// Book Service (Port 8004)
	BOOK_SERVICE: {
		BASE_URL: getBackendUrl(8004),
		ENDPOINTS: {
			LIST: '/api/books',
			GET: (id: string) => `/api/books/${id}`,
			CHAPTER: (id: string, chapter: number) => `/api/books/${id}/chapters/${chapter}`,
			PROGRESS: (id: string) => `/api/books/${id}/progress`,
			RATE: (id: string) => `/api/books/${id}/rate`,
			CONTINUE_READING: '/api/books/continue-reading',
		},
	},

	// Collection Service (Port 8005)
	COLLECTION_SERVICE: {
		BASE_URL: getBackendUrl(8005),
		ENDPOINTS: {
			LIST: '/api/collections',
			CREATE: '/api/collections',
			GET: (id: string) => `/api/collections/${id}`,
			UPDATE: (id: string) => `/api/collections/${id}`,
			DELETE: (id: string) => `/api/collections/${id}`,
			ADD_ITEM: (id: string) => `/api/collections/${id}/items`,
			REMOVE_ITEM: (id: string, contentId: string) => `/api/collections/${id}/items/${contentId}`,
			PUBLIC: '/api/collections/public/browse',
			SEARCH: '/api/collections/search/query',
		},
	},
} as const

export default BACKEND_CONFIG

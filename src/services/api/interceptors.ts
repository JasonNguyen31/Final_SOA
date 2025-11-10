import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export interface ApiErrorResponse {
	message: string
	status: number
	errors?: Record<string, string[]>
}

// Setup request and response interceptors
export const setupInterceptors = (axiosInstance: AxiosInstance) => {
	// Request interceptor
	axiosInstance.interceptors.request.use(
		(config: InternalAxiosRequestConfig) => {
			// Get token from localStorage
			const token = localStorage.getItem('auth_token')

			if (token) {
				config.headers.Authorization = `Bearer ${token}`
			}

			// Log request in development
			if (import.meta.env.DEV) {
				console.log('=€ Request:', config.method?.toUpperCase(), config.url)
			}

			return config
		},
		(error: AxiosError) => {
			console.error('L Request Error:', error)
			return Promise.reject(error)
		}
	)

	// Response interceptor
	axiosInstance.interceptors.response.use(
		(response: AxiosResponse) => {
			// Log response in development
			if (import.meta.env.DEV) {
				console.log(' Response:', response.status, response.config.url)
			}

			return response
		},
		(error: AxiosError<ApiErrorResponse>) => {
			// Handle different error cases
			if (error.response) {
				const { status, data } = error.response

				// Handle specific status codes
				switch (status) {
					case 401:
						// Unauthorized - clear token and redirect to login
						localStorage.removeItem('auth_token')
						localStorage.removeItem('user')
						window.location.href = '/auth/login'
						break

					case 403:
						// Forbidden
						console.error('L Access denied:', data.message)
						break

					case 404:
						// Not found
						console.error('L Resource not found:', data.message)
						break

					case 422:
						// Validation error
						console.error('L Validation error:', data.errors)
						break

					case 500:
						// Server error
						console.error('L Server error:', data.message)
						break

					default:
						console.error('L API Error:', data.message)
				}
			} else if (error.request) {
				// Request was made but no response received
				console.error('L Network Error: No response received')
			} else {
				// Something happened in setting up the request
				console.error('L Request Setup Error:', error.message)
			}

			return Promise.reject(error)
		}
	)
}

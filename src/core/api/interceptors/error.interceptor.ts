import type { AxiosError, AxiosResponse } from 'axios'
import { parseApiError, UnauthorizedError } from '../utils/errors'
import { storageService } from '@/core/storage/storageService'

/**
 * Error Interceptor - Handles API errors globally
 */
export const errorInterceptor = {
	onResponse: (response: AxiosResponse): AxiosResponse => {
		return response
	},

	onResponseError: async (error: AxiosError): Promise<any> => {
		const parsedError = parseApiError(error)

		// Handle 401 Unauthorized - clear auth only (no redirect, will show modal)
		if (parsedError instanceof UnauthorizedError) {
			storageService.clearAuth()
			// Don't redirect - the app will handle showing login modal
		}

		// Log error in development
		if (import.meta.env.DEV) {
			console.error('API Error:', {
				url: error.config?.url,
				method: error.config?.method,
				status: error.response?.status,
				message: parsedError.message,
				error: parsedError
			})
		}

		return Promise.reject(parsedError)
	}
}

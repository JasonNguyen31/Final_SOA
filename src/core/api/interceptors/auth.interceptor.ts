import type { InternalAxiosRequestConfig } from 'axios'
import { storageService } from '@/core/storage/storageService'

/**
 * Auth Interceptor - Adds authentication token to requests
 */
export const authInterceptor = {
	onRequest: (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
		const token = storageService.getToken()

		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}

		return config
	},

	onRequestError: (error: any): Promise<any> => {
		return Promise.reject(error)
	}
}

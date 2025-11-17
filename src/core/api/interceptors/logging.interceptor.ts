import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Logging Interceptor - Logs API requests and responses in development
 */
export const loggingInterceptor = {
	onRequest: (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
		if (import.meta.env.DEV) {
			console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
				params: config.params,
				data: config.data
			})
		}
		return config
	},

	onRequestError: (error: any): Promise<any> => {
		if (import.meta.env.DEV) {
			console.error('[API Request Error]', error)
		}
		return Promise.reject(error)
	},

	onResponse: (response: AxiosResponse): AxiosResponse => {
		if (import.meta.env.DEV) {
			console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
				status: response.status,
				data: response.data
			})
		}
		return response
	},

	onResponseError: (error: any): Promise<any> => {
		if (import.meta.env.DEV) {
			console.error('[API Response Error]', {
				url: error.config?.url,
				status: error.response?.status,
				message: error.message
			})
		}
		return Promise.reject(error)
	}
}

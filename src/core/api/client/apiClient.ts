import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { authInterceptor } from '../interceptors/auth.interceptor'
import { errorInterceptor } from '../interceptors/error.interceptor'
import { loggingInterceptor } from '../interceptors/logging.interceptor'
import { isRetryableError } from '../utils/errors'

// API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000, // 30 seconds
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true // Send cookies with requests
})

// Request Interceptors
axiosInstance.interceptors.request.use(
	authInterceptor.onRequest,
	authInterceptor.onRequestError
)

axiosInstance.interceptors.request.use(
	loggingInterceptor.onRequest,
	loggingInterceptor.onRequestError
)

// Response Interceptors
axiosInstance.interceptors.response.use(
	loggingInterceptor.onResponse,
	loggingInterceptor.onResponseError
)

axiosInstance.interceptors.response.use(
	errorInterceptor.onResponse,
	errorInterceptor.onResponseError
)

/**
 * API Client with retry logic and helper methods
 */
class ApiClient {
	private instance: AxiosInstance

	constructor(axiosInstance: AxiosInstance) {
		this.instance = axiosInstance
	}

	/**
	 * GET request
	 */
	async get<T = any>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response = await this.instance.get<T>(url, config)
		return response.data
	}

	/**
	 * GET request with retry
	 */
	async getWithRetry<T = any>(
		url: string,
		config?: AxiosRequestConfig,
		maxRetries: number = 3,
		retryDelay: number = 1000
	): Promise<T> {
		let lastError: any

		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				return await this.get<T>(url, config)
			} catch (error) {
				lastError = error

				// Don't retry if error is not retryable or if this is the last attempt
				if (!isRetryableError(error) || attempt === maxRetries) {
					throw error
				}

				// Wait before retrying (exponential backoff)
				await this.delay(retryDelay * Math.pow(2, attempt))
			}
		}

		throw lastError
	}

	/**
	 * POST request
	 */
	async post<T = any>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response = await this.instance.post<T>(url, data, config)
		return response.data
	}

	/**
	 * PUT request
	 */
	async put<T = any>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response = await this.instance.put<T>(url, data, config)
		return response.data
	}

	/**
	 * PATCH request
	 */
	async patch<T = any>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response = await this.instance.patch<T>(url, data, config)
		return response.data
	}

	/**
	 * DELETE request
	 */
	async delete<T = any>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response = await this.instance.delete<T>(url, config)
		return response.data
	}

	/**
	 * Raw request (for custom needs)
	 */
	async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.instance.request<T>(config)
	}

	/**
	 * Helper: Delay for retry logic
	 */
	private delay(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms))
	}

	/**
	 * Get axios instance (for advanced use cases)
	 */
	getAxiosInstance(): AxiosInstance {
		return this.instance
	}
}

// Export singleton instance
export const apiClient = new ApiClient(axiosInstance)

// Export raw axios instance for backward compatibility
export const axiosClient = axiosInstance

// API Error Handling Utilities

export class ApiError extends Error {
	statusCode?: number
	code?: string
	errors?: Record<string, string[]>

	constructor(
		message: string,
		statusCode?: number,
		code?: string,
		errors?: Record<string, string[]>
	) {
		super(message)
		this.name = 'ApiError'
		this.statusCode = statusCode
		this.code = code
		this.errors = errors
		Object.setPrototypeOf(this, ApiError.prototype)
	}
}

export class NetworkError extends Error {
	constructor(message: string = 'Network connection failed') {
		super(message)
		this.name = 'NetworkError'
		Object.setPrototypeOf(this, NetworkError.prototype)
	}
}

export class ValidationError extends ApiError {
	constructor(message: string, errors: Record<string, string[]>) {
		super(message, 422, 'VALIDATION_ERROR', errors)
		this.name = 'ValidationError'
		Object.setPrototypeOf(this, ValidationError.prototype)
	}
}

export class UnauthorizedError extends ApiError {
	constructor(message: string = 'Unauthorized access') {
		super(message, 401, 'UNAUTHORIZED')
		this.name = 'UnauthorizedError'
		Object.setPrototypeOf(this, UnauthorizedError.prototype)
	}
}

export class ForbiddenError extends ApiError {
	constructor(message: string = 'Access forbidden') {
		super(message, 403, 'FORBIDDEN')
		this.name = 'ForbiddenError'
		Object.setPrototypeOf(this, ForbiddenError.prototype)
	}
}

export class NotFoundError extends ApiError {
	constructor(message: string = 'Resource not found') {
		super(message, 404, 'NOT_FOUND')
		this.name = 'NotFoundError'
		Object.setPrototypeOf(this, NotFoundError.prototype)
	}
}

export class ServerError extends ApiError {
	constructor(message: string = 'Internal server error') {
		super(message, 500, 'SERVER_ERROR')
		this.name = 'ServerError'
		Object.setPrototypeOf(this, ServerError.prototype)
	}
}

/**
 * Parse error response from API
 */
export function parseApiError(error: any): ApiError {
	// Network errors
	if (!error.response) {
		return new NetworkError(error.message || 'Network connection failed')
	}

	const { status, data } = error.response

	// Handle FastAPI error format: {detail: {success: false, error: "..."}} or {detail: "..."}
	let message: string
	let errors: any

	if (typeof data?.detail === 'object' && data.detail !== null) {
		// Backend returns {detail: {success: false, error: "..."}}
		message = data.detail.error || data.detail.message || 'An error occurred'
		errors = data.detail.errors
	} else if (typeof data?.detail === 'string') {
		// Backend returns {detail: "..."}
		message = data.detail
	} else {
		// Fallback to standard format
		message = data?.message || data?.error || 'An error occurred'
		errors = data?.errors
	}

	// Create appropriate error based on status code
	switch (status) {
		case 400:
			return new ApiError(message, 400, 'BAD_REQUEST')
		case 401:
			return new UnauthorizedError(message)
		case 403:
			return new ForbiddenError(message)
		case 404:
			return new NotFoundError(message)
		case 422:
			return new ValidationError(message, errors || {})
		case 429:
			return new ApiError('Too many requests. Please wait a moment before trying again.', 429, 'RATE_LIMIT')
		case 500:
		case 502:
		case 503:
		case 504:
			return new ServerError(message)
		default:
			return new ApiError(message, status)
	}
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
	if (error instanceof NetworkError) return true
	if (error instanceof ServerError) return true
	if (error instanceof ApiError) {
		const retryableCodes = [408, 429, 500, 502, 503, 504]
		return retryableCodes.includes(error.statusCode || 0)
	}
	return false
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: any): string {
	if (error instanceof ValidationError) {
		const firstError = Object.values(error.errors || {})[0]
		return firstError?.[0] || error.message
	}

	if (error instanceof UnauthorizedError) {
		// Check for specific login error messages
		const message = error.message.toLowerCase()
		if (message.includes('invalid') || message.includes('credential')) {
			return 'Account does not exist or password is incorrect'
		}
		return error.message || 'Please log in to continue'
	}

	if (error instanceof ForbiddenError) {
		return error.message || 'You do not have permission to perform this action'
	}

	if (error instanceof NotFoundError) {
		return error.message || 'The requested resource was not found'
	}

	if (error instanceof NetworkError) {
		return 'Connection failed. Please check your internet connection'
	}

	if (error instanceof ServerError) {
		return error.message || 'Server error. Please try again later'
	}

	if (error instanceof ApiError) {
		// Return the actual error message from API
		return error.message
	}

	// If it's a raw axios error with response
	if (error?.response?.data) {
		const data = error.response.data

		// Handle {success: false, error: "..."} format
		if (typeof data === 'object' && data.error) {
			return typeof data.error === 'string' ? data.error : 'An error occurred'
		}

		if (typeof data?.detail === 'object' && data.detail.error) {
			return data.detail.error
		}
		if (typeof data?.detail === 'string') {
			return data.detail
		}
		if (data?.message) {
			return data.message
		}
	}

	return error?.message || 'An unexpected error occurred'
}

import axios, { type AxiosInstance } from 'axios'
import { BACKEND_CONFIG } from '@/config/backend.config'
import { storageService, type User } from '@/core/storage/storageService'

// Create dedicated axios instance for auth service
const authAxios: AxiosInstance = axios.create({
	baseURL: BACKEND_CONFIG.AUTH_SERVICE.BASE_URL,
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true, // Important: Enable cookies for refresh token
})

// Add request interceptor to attach access token
authAxios.interceptors.request.use(
	(config) => {
		const token = storageService.getToken()
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// Request/Response Types
export interface LoginCredentials {
	identifier: string // Email or username
	password: string
	rememberMe?: boolean
}

export interface RegisterData {
	email: string
	username: string
	password: string
	displayName: string
	acceptTerms?: boolean
}

export interface VerifyOTPData {
	email: string
	otp: string
}

export interface AuthResponse {
	accessToken: string
	user: User
}

export interface ForgotPasswordData {
	email: string
}

export interface ResetPasswordData {
	token: string
	newPassword: string
}

/**
 * Authentication Service
 * Handles all authentication-related API calls to FastAPI backend
 */
class AuthService {
	/**
	 * Register new user (Step 1: Send OTP)
	 */
	async register(data: RegisterData): Promise<{ message: string; email: string }> {
		try {
			console.log('Sending registration request:', {
				email: data.email,
				username: data.username,
				displayName: data.displayName,
				// Don't log password for security
			})

			const response = await authAxios.post(
				BACKEND_CONFIG.AUTH_SERVICE.ENDPOINTS.REGISTER,
				{
					email: data.email,
					username: data.username,
					password: data.password,
					displayName: data.displayName,
				}
			)

			console.log('Registration response:', response.data)

			// Backend returns { success, data: { userId, email, otpExpiresAt } }
			// Transform to expected format
			if (response.data.success) {
				return {
					message: 'Registration successful! Please check your email for OTP.',
					email: response.data.data.email
				}
			}

			throw new Error('Registration failed')
		} catch (error: any) {
			console.error('Registration error:', {
				message: error.message,
				response: error.response?.data,
				status: error.response?.status,
			})
			throw error
		}
	}

	/**
	 * Verify OTP (Step 2: Complete registration)
	 */
	async verifyOTP(data: VerifyOTPData): Promise<{ message: string }> {
		const response = await authAxios.post(
			BACKEND_CONFIG.AUTH_SERVICE.ENDPOINTS.VERIFY_OTP,
			data
		)
		return response.data
	}

	/**
	 * Login user with email/username and password
	 */
	async login(credentials: LoginCredentials): Promise<AuthResponse> {
		const response = await authAxios.post<{ success: boolean; data: AuthResponse }>(
			BACKEND_CONFIG.AUTH_SERVICE.ENDPOINTS.LOGIN,
			{
				identifier: credentials.identifier,
				password: credentials.password,
			}
		)

		// Backend returns { success: true, data: { accessToken, user } }
		const { accessToken, user } = response.data.data

		// Store access token and user data
		// Refresh token is stored in httpOnly cookie by backend
		storageService.setToken(accessToken)
		storageService.setUser(user)
		storageService.setRememberMe(credentials.rememberMe || false)

		return { accessToken, user }
	}

	/**
	 * Logout user
	 */
	async logout(): Promise<void> {
		try {
			const token = storageService.getToken()
			// Call logout endpoint to invalidate tokens on server
			await authAxios.post(
				BACKEND_CONFIG.AUTH_SERVICE.ENDPOINTS.LOGOUT,
				{},
				{
					headers: token ? { Authorization: `Bearer ${token}` } : {},
				}
			)
		} catch (error) {
			// Even if API call fails, clear local storage
			console.error('Logout API call failed:', error)
		} finally {
			// Clear all auth data from storage
			storageService.clearAuth()
		}
	}

	/**
	 * Refresh access token using httpOnly cookie
	 */
	async refreshToken(): Promise<AuthResponse> {
		const response = await authAxios.post<{ accessToken: string }>(
			BACKEND_CONFIG.AUTH_SERVICE.ENDPOINTS.REFRESH
		)

		// Update access token (refresh token is already in cookie)
		storageService.setToken(response.data.accessToken)

		// Get user data from token or fetch from server
		const user = storageService.getUser()
		return {
			accessToken: response.data.accessToken,
			user: user as User,
		}
	}

	/**
	 * Request password reset
	 */
	async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
		const response = await authAxios.post(
			BACKEND_CONFIG.AUTH_SERVICE.ENDPOINTS.FORGOT_PASSWORD,
			data
		)
		return response.data
	}

	/**
	 * Reset password with token
	 */
	async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
		const response = await authAxios.post(
			BACKEND_CONFIG.AUTH_SERVICE.ENDPOINTS.RESET_PASSWORD,
			data
		)
		return response.data
	}

	/**
	 * Check if user is authenticated
	 */
	isAuthenticated(): boolean {
		const token = storageService.getToken()
		const user = storageService.getUser()
		return !!(token && user)
	}

	/**
	 * Get current user from storage
	 */
	getCurrentUser(): User | null {
		return storageService.getUser()
	}

	/**
	 * Get current auth token
	 */
	getToken(): string | null {
		return storageService.getToken()
	}

	/**
	 * Check if user has specific role
	 */
	hasRole(role: 'user' | 'admin' | 'moderator'): boolean {
		const user = this.getCurrentUser()
		return user?.role === role
	}

	/**
	 * Check if user is admin or moderator
	 */
	isAdminOrModerator(): boolean {
		return this.hasRole('admin') || this.hasRole('moderator')
	}
}

// Export singleton instance
export const authService = new AuthService()

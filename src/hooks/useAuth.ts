import { useState, useCallback } from 'react'
import { authService, type LoginCredentials, type RegisterData, type VerifyOTPData } from '@/services/auth/authService'
import { userService } from '@/services/user/userService'
import { getUserFriendlyErrorMessage, parseApiError } from '@/core/api/utils/errors'
import { useAuth as useAuthContext } from '@/context/AuthContext'

export const useAuth = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const authContext = useAuthContext()

	const login = useCallback(async (credentials: LoginCredentials) => {
		try {
			setLoading(true)
			setError(null)
			const response = await authService.login(credentials)

			// Update AuthContext after successful login with rememberMe preference
			authContext.login(response.accessToken, response.user, credentials.rememberMe)

			// Fetch updated user profile to ensure displayName and other fields are current
			try {
				const userProfile = await userService.getProfile()
				authContext.updateUser(userProfile)
			} catch (profileError) {
				// If profile fetch fails, continue with login (user data from login response is already saved)
				// Silently ignore - user service might be unavailable but auth still works
				if (import.meta.env.DEV) {
					console.warn('User profile fetch failed - continuing with login data')
				}
			}

			return response
		} catch (err) {
			const parsedError = parseApiError(err)
			const message = getUserFriendlyErrorMessage(parsedError)
			setError(message)
			throw parsedError
		} finally {
			setLoading(false)
		}
	}, [authContext])

	const register = useCallback(async (data: RegisterData) => {
		try {
			setLoading(true)
			setError(null)
			const response = await authService.register(data)
			return response
		} catch (err) {
			const parsedError = parseApiError(err)
			const message = getUserFriendlyErrorMessage(parsedError)
			setError(message)
			throw parsedError
		} finally {
			setLoading(false)
		}
	}, [])

	const logout = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			await authService.logout()

			// Clear AuthContext after logout
			authContext.logout()
		} catch (err) {
			const parsedError = parseApiError(err)
			const message = getUserFriendlyErrorMessage(parsedError)
			setError(message)
			throw parsedError
		} finally {
			setLoading(false)
		}
	}, [authContext])

	const verifyOTP = useCallback(async (data: VerifyOTPData) => {
		try {
			setLoading(true)
			setError(null)
			const response = await authService.verifyOTP(data)
			return response
		} catch (err) {
			const parsedError = parseApiError(err)
			const message = getUserFriendlyErrorMessage(parsedError)
			setError(message)
			throw parsedError
		} finally {
			setLoading(false)
		}
	}, [])

	const forgotPassword = useCallback(async (email: string) => {
		try {
			setLoading(true)
			setError(null)
			await authService.forgotPassword({ email })
		} catch (err) {
			const parsedError = parseApiError(err)
			const message = getUserFriendlyErrorMessage(parsedError)
			setError(message)
			throw parsedError
		} finally {
			setLoading(false)
		}
	}, [])

	const resetPassword = useCallback(async (token: string, newPassword: string) => {
		try {
			setLoading(true)
			setError(null)
			await authService.resetPassword({ token, newPassword })
		} catch (err) {
			const parsedError = parseApiError(err)
			const message = getUserFriendlyErrorMessage(parsedError)
			setError(message)
			throw parsedError
		} finally {
			setLoading(false)
		}
	}, [])

	const clearError = useCallback(() => {
		setError(null)
	}, [])

	return {
		login,
		register,
		verifyOTP,
		logout,
		forgotPassword,
		resetPassword,
		loading,
		error,
		clearError,
		isAuthenticated: authService.isAuthenticated(),
		currentUser: authService.getCurrentUser(),
		hasRole: authService.hasRole.bind(authService),
		isAdminOrModerator: authService.isAdminOrModerator()
	}
}

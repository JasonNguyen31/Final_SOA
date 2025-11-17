import { storageService } from '@/core/storage/storageService'
import { authService } from './authService'

/**
 * Token Service
 * Handles token management and automatic refresh
 */
class TokenService {
	private refreshPromise: Promise<any> | null = null

	/**
	 * Get access token
	 */
	getAccessToken(): string | null {
		return storageService.getToken()
	}

	/**
	 * Get refresh token
	 */
	getRefreshToken(): string | null {
		return storageService.getRefreshToken()
	}

	/**
	 * Check if token exists
	 */
	hasToken(): boolean {
		return !!this.getAccessToken()
	}

	/**
	 * Decode JWT token (without verification)
	 * Note: This is NOT secure - use only for reading claims
	 */
	decodeToken(token: string): any {
		try {
			const base64Url = token.split('.')[1]
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
			const jsonPayload = decodeURIComponent(
				atob(base64)
					.split('')
					.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
					.join('')
			)
			return JSON.parse(jsonPayload)
		} catch (error) {
			console.error('Failed to decode token:', error)
			return null
		}
	}

	/**
	 * Check if token is expired
	 */
	isTokenExpired(token?: string): boolean {
		const tokenToCheck = token || this.getAccessToken()
		if (!tokenToCheck) return true

		const decoded = this.decodeToken(tokenToCheck)
		if (!decoded || !decoded.exp) return true

		const currentTime = Date.now() / 1000
		return decoded.exp < currentTime
	}

	/**
	 * Check if token will expire soon (within 5 minutes)
	 */
	isTokenExpiringSoon(token?: string): boolean {
		const tokenToCheck = token || this.getAccessToken()
		if (!tokenToCheck) return true

		const decoded = this.decodeToken(tokenToCheck)
		if (!decoded || !decoded.exp) return true

		const currentTime = Date.now() / 1000
		const fiveMinutes = 5 * 60
		return decoded.exp < currentTime + fiveMinutes
	}

	/**
	 * Refresh token if needed
	 * Uses singleton pattern to prevent multiple simultaneous refresh calls
	 */
	async refreshTokenIfNeeded(): Promise<void> {
		const accessToken = this.getAccessToken()
		const refreshToken = this.getRefreshToken()

		// No tokens - can't refresh
		if (!refreshToken) {
			return
		}

		// Access token still valid - no need to refresh
		if (accessToken && !this.isTokenExpiringSoon(accessToken)) {
			return
		}

		// Already refreshing - wait for existing promise
		if (this.refreshPromise) {
			await this.refreshPromise
			return
		}

		// Start refresh
		try {
			this.refreshPromise = authService.refreshToken()
			await this.refreshPromise
		} catch (error) {
			console.error('Token refresh failed:', error)
			// Clear auth data on refresh failure
			storageService.clearAuth()
			throw error
		} finally {
			this.refreshPromise = null
		}
	}

	/**
	 * Clear all tokens
	 */
	clearTokens(): void {
		storageService.clearAuth()
	}
}

// Export singleton instance
export const tokenService = new TokenService()

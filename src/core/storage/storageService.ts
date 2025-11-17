// Centralized storage service for localStorage operations

const STORAGE_KEYS = {
	AUTH_TOKEN: 'auth_token',
	REFRESH_TOKEN: 'refresh_token',
	USER: 'user',
	THEME: 'theme',
	LANGUAGE: 'language',
	REMEMBER_ME: 'remember_me'
} as const

export interface User {
	id: string
	email: string
	username: string
	fullName: string
	displayName?: string
	avatar?: string
	role: 'user' | 'admin' | 'moderator'
	isPremium: boolean
	premiumExpiresAt?: string
	wallet?: {
		balance: number
		currency: string
	}
}

class StorageService {
	// Helper to determine which storage to use
	private getStorage(): Storage {
		const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
		return rememberMe ? localStorage : sessionStorage
	}

	// Auth Token Management
	setToken(token: string): void {
		const storage = this.getStorage()
		storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
	}

	getToken(): string | null {
		// Check both storages
		return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ||
		       sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
	}

	removeToken(): void {
		localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
		sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
	}

	// Refresh Token Management
	setRefreshToken(token: string): void {
		localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token)
	}

	getRefreshToken(): string | null {
		return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
	}

	removeRefreshToken(): void {
		localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
	}

	// User Management
	setUser(user: User): void {
		const storage = this.getStorage()
		storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
	}

	getUser(): User | null {
		// Check both storages
		const userStr = localStorage.getItem(STORAGE_KEYS.USER) ||
		                sessionStorage.getItem(STORAGE_KEYS.USER)

		if (!userStr || userStr === 'undefined' || userStr === 'null') return null

		try {
			return JSON.parse(userStr)
		} catch (error) {
			console.error('Failed to parse user from storage:', error)
			this.removeUser() // Clear corrupted data
			return null
		}
	}

	removeUser(): void {
		localStorage.removeItem(STORAGE_KEYS.USER)
		sessionStorage.removeItem(STORAGE_KEYS.USER)
	}

	// Theme Management
	setTheme(theme: 'light' | 'dark'): void {
		localStorage.setItem(STORAGE_KEYS.THEME, theme)
	}

	getTheme(): 'light' | 'dark' | null {
		return localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' | null
	}

	// Language Management
	setLanguage(language: string): void {
		localStorage.setItem(STORAGE_KEYS.LANGUAGE, language)
	}

	getLanguage(): string | null {
		return localStorage.getItem(STORAGE_KEYS.LANGUAGE)
	}

	// Remember Me
	setRememberMe(remember: boolean): void {
		localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, remember.toString())
	}

	getRememberMe(): boolean {
		return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
	}

	// Clear all auth-related data
	clearAuth(): void {
		this.removeToken()
		this.removeRefreshToken()
		this.removeUser()
		// Also clear from sessionStorage
		sessionStorage.clear()
	}

	// Clear all storage
	clearAll(): void {
		Object.values(STORAGE_KEYS).forEach(key => {
			localStorage.removeItem(key)
		})
	}
}

// Export singleton instance
export const storageService = new StorageService()

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '@/types/user.types'

interface AuthContextType {
	user: User | null
	token: string | null
	isAuthenticated: boolean
	isLoading: boolean
	login: (token: string, user: User, rememberMe?: boolean) => void
	logout: () => void
	updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider')
	}
	return context
}

interface AuthProviderProps {
	children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null)
	const [token, setToken] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	// Load auth state from localStorage or sessionStorage on mount
	useEffect(() => {
		// Try localStorage first (Remember Me = true)
		let storedToken = localStorage.getItem('auth_token')
		let storedUser = localStorage.getItem('user')
		let storage: Storage = localStorage

		// If not in localStorage, try sessionStorage (Remember Me = false)
		if (!storedToken) {
			storedToken = sessionStorage.getItem('auth_token')
			storedUser = sessionStorage.getItem('user')
			storage = sessionStorage
		}

		if (storedToken && storedUser) {
			try {
				const parsedUser = JSON.parse(storedUser)
				setToken(storedToken)
				setUser(parsedUser)
			} catch (error) {
				console.error('Failed to parse user data:', error)
				storage.removeItem('auth_token')
				storage.removeItem('user')
			}
		}

		setIsLoading(false)
	}, [])

	const login = (newToken: string, newUser: User, rememberMe: boolean = false) => {
		setToken(newToken)
		setUser(newUser)

		// Store based on Remember Me preference
		const storage = rememberMe ? localStorage : sessionStorage
		storage.setItem('auth_token', newToken)
		storage.setItem('user', JSON.stringify(newUser))

		// Also store the remember me preference
		localStorage.setItem('remember_me', rememberMe.toString())
	}

	const logout = () => {
		setToken(null)
		setUser(null)
		localStorage.removeItem('auth_token')
		localStorage.removeItem('user')
		// Also clear any other auth-related data
		localStorage.removeItem('refresh_token')
		localStorage.removeItem('remember_me')
		// Clear session storage as well
		sessionStorage.clear()
	}

	const updateUser = (updatedUser: User) => {
		setUser(updatedUser)

		// Update in the same storage that was used during login
		const rememberMe = localStorage.getItem('remember_me') === 'true'
		const storage = rememberMe ? localStorage : sessionStorage
		storage.setItem('user', JSON.stringify(updatedUser))
	}

	const value: AuthContextType = {
		user,
		token,
		isAuthenticated: !!token && !!user,
		isLoading,
		login,
		logout,
		updateUser,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext

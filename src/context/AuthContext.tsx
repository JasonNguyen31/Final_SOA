import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '@/types/user.types'

interface AuthContextType {
	user: User | null
	token: string | null
	isAuthenticated: boolean
	isLoading: boolean
	login: (token: string, user: User) => void
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

	// Load auth state from localStorage on mount
	useEffect(() => {
		const storedToken = localStorage.getItem('auth_token')
		const storedUser = localStorage.getItem('user')

		if (storedToken && storedUser) {
			try {
				setToken(storedToken)
				setUser(JSON.parse(storedUser))
			} catch (error) {
				console.error('Failed to parse user data:', error)
				localStorage.removeItem('auth_token')
				localStorage.removeItem('user')
			}
		}

		setIsLoading(false)
	}, [])

	const login = (newToken: string, newUser: User) => {
		setToken(newToken)
		setUser(newUser)
		localStorage.setItem('auth_token', newToken)
		localStorage.setItem('user', JSON.stringify(newUser))
	}

	const logout = () => {
		setToken(null)
		setUser(null)
		localStorage.removeItem('auth_token')
		localStorage.removeItem('user')
	}

	const updateUser = (updatedUser: User) => {
		setUser(updatedUser)
		localStorage.setItem('user', JSON.stringify(updatedUser))
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

import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * Hook to prevent navigation back to auth pages after login
 * and to protect routes from unauthenticated access
 */
export const useNavigationGuard = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { isAuthenticated } = useAuth()

	useEffect(() => {
		// List of auth pages that shouldn't be accessible when logged in
		const authPages = ['/auth/login', '/auth/register', '/auth/verify-otp', '/auth/forgot-password', '/']

		// If user is authenticated and tries to access auth pages
		if (isAuthenticated && authPages.includes(location.pathname)) {
			navigate('/home', { replace: true })
		}
	}, [isAuthenticated, location.pathname, navigate])
}

/**
 * Hook to prevent back navigation after successful login
 * Call this in protected pages
 */
export const usePreventBackNavigation = () => {
	useEffect(() => {
		// Push a dummy state to prevent back navigation
		window.history.pushState(null, '', window.location.href)

		const handlePopState = (event: PopStateEvent) => {
			// Push state again to keep user on current page
			window.history.pushState(null, '', window.location.href)
		}

		window.addEventListener('popstate', handlePopState)

		return () => {
			window.removeEventListener('popstate', handlePopState)
		}
	}, [])
}

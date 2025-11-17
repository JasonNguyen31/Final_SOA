import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'

interface PrivateRouteProps {
	requiredRole?: 'user' | 'admin' | 'moderator'
}

export const PrivateRoute = ({ requiredRole }: PrivateRouteProps) => {
	const { isAuthenticated, user, isLoading } = useAuth()
	const location = useLocation()

	// Prevent back navigation to login/register pages after authentication
	useEffect(() => {
		if (isAuthenticated) {
			// Clear the history to prevent going back to auth pages
			window.history.replaceState(null, '', location.pathname)
		}
	}, [isAuthenticated, location.pathname])

	// Prevent back navigation after logout
	useEffect(() => {
		const handlePopState = () => {
			if (!isAuthenticated) {
				// If user is not authenticated and trying to go back, redirect to landing
				window.location.href = '/'
			}
		}

		window.addEventListener('popstate', handlePopState)
		return () => window.removeEventListener('popstate', handlePopState)
	}, [isAuthenticated])

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center bg-gray-900">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
					<div className="text-lg text-white">Loading...</div>
				</div>
			</div>
		)
	}

	// Redirect to login if not authenticated
	// Save the current location to redirect back after login
	if (!isAuthenticated) {
		return <Navigate to="/auth/login" state={{ from: location }} replace />
	}

	// Check role if required
	if (requiredRole && user?.role !== requiredRole) {
		// Redirect to home if user doesn't have required role
		return <Navigate to="/home" replace />
	}

	return <Outlet />
}

export default PrivateRoute

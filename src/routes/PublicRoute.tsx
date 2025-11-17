import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * PublicRoute component
 * Protects auth pages (login, register) from authenticated users
 * Redirects authenticated users to home page
 */
export const PublicRoute = () => {
	const { isAuthenticated, isLoading } = useAuth()

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

	// If user is already authenticated, redirect to home
	if (isAuthenticated) {
		return <Navigate to="/home" replace />
	}

	// Otherwise, allow access to public routes
	return <Outlet />
}

export default PublicRoute

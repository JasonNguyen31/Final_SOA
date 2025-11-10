import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface PrivateRouteProps {
	requiredRole?: 'user' | 'admin'
}

export const PrivateRoute = ({ requiredRole }: PrivateRouteProps) => {
	const { isAuthenticated, user, isLoading } = useAuth()

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-lg">Loading...</div>
			</div>
		)
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated) {
		return <Navigate to="/auth/login" replace />
	}

	// Check role if required
	if (requiredRole && user?.role !== requiredRole) {
		// Redirect to home if user doesn't have required role
		return <Navigate to="/" replace />
	}

	return <Outlet />
}

export default PrivateRoute

import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'

// Auth Pages
import ForgotPasswordPage from '@/pages/auth/ForgotPassword/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPassword/ResetPasswordPage'

// User Pages
import LandingPage from '@/pages/user/Landing/LandingPage'
import HomePage from '@/pages/user/Home/HomePage'
import BooksPage from '@/pages/user/Books/BooksPage'
import BookDetail from '@/pages/user/Books/BookDetail'
import BookReader from '@/pages/user/Books/BookReader'

import MovieDetailPage from '@/pages/user/Movies/MovieDetailPage'
import MovieWatch from '@/pages/user/Movies/MovieWatch'
import ProfilePage from '@/pages/user/Profile/ProfilePage'
import ReadHistory from '@/pages/user/Profile/ReadHistory'
import WatchHistory from '@/pages/user/Profile/WatchHistory'
import Collections from '@/pages/user/Profile/Collections'
import WalletPage from '@/pages/user/Wallet/WalletPage'
import TransactionHistory from '@/pages/user/Wallet/TransactionHistory'
import PremiumPage from '@/pages/user/Premium/PremiumPage'

// Admin Pages
import DashboardPage from '@/pages/admin/Dashboard/DashboardPage'
import UsersPage from '@/pages/admin/UserManagement/UsersPage'
import CommentsPage from '@/pages/admin/CommentModeration/CommentsPage'
import BooksManagement from '@/pages/admin/ContentManagement/BooksManagement'
import MoviesManagement from '@/pages/admin/ContentManagement/MoviesManagement'
import AnalyticsPage from '@/pages/admin/Analytics/AnalyticsPage'
import ReportsPage from '@/pages/admin/Reports/ReportsPage'

export const AppRoutes = () => {
	return (
		<Routes>
			{/* Landing page - Accessible to everyone */}
			<Route path="/" element={<LandingPage />} />

			{/* Movie Detail - Accessible to everyone (guest can view details but need to login to watch) */}
			<Route path="/movies/:id" element={<MovieDetailPage />} />

			{/* Public Routes - Only for non-authenticated users, redirect to /home if logged in */}
			<Route element={<PublicRoute />}>
				{/* Auth Routes - Removed login/register routes, now using modals only */}
				<Route path="/auth">
					<Route path="forgot-password" element={<ForgotPasswordPage />} />
				</Route>
			</Route>

			{/* Reset Password - Always accessible (không bị redirect) */}
			<Route path="/auth/reset-password" element={<ResetPasswordPage />} />

			{/* User Routes - Protected */}
			<Route element={<PrivateRoute />}>
				<Route path="/home" element={<HomePage />} />

				<Route path="/books">
					<Route index element={<BooksPage />} />
					<Route path=":id" element={<BookDetail />} />
					<Route path=":id/read" element={<BookReader />} />
				</Route>

				<Route path="/movies">
					<Route path=":id/watch" element={<MovieWatch />} />
				</Route>

				<Route path="/profile">
					<Route index element={<ProfilePage />} />
					<Route path="read-history" element={<ReadHistory />} />
					<Route path="watch-history" element={<WatchHistory />} />
					<Route path="collections" element={<Collections />} />
				</Route>


				<Route path="/wallet">
					<Route index element={<WalletPage />} />
					<Route path="transactions" element={<TransactionHistory />} />
				</Route>

				<Route path="/premium" element={<PremiumPage />} />
			</Route>

			{/* Admin Routes - Protected with admin role */}
			<Route element={<PrivateRoute requiredRole="admin" />}>
				<Route path="/admin">
					<Route index element={<Navigate to="/admin/dashboard" replace />} />
					<Route path="dashboard" element={<DashboardPage />} />
					<Route path="users" element={<UsersPage />} />
					<Route path="comments" element={<CommentsPage />} />
					<Route path="books" element={<BooksManagement />} />
					<Route path="movies" element={<MoviesManagement />} />
					<Route path="analytics" element={<AnalyticsPage />} />
					<Route path="reports" element={<ReportsPage />} />
				</Route>
			</Route>

			{/* 404 Not Found */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}

export default AppRoutes

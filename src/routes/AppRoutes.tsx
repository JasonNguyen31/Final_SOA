import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'

// Auth Pages
import LoginPage from '@/pages/auth/Login/LoginPage'
import RegisterPage from '@/pages/auth/Register/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPassword/ForgotPasswordPage'
import VerifyOTPPage from '@/pages/auth/VerifyOTP/VerifyOTPPage'

// User Pages
import HomePage from '@/pages/user/Home/HomePage'
import BooksPage from '@/pages/user/Books/BooksPage'
import BookDetail from '@/pages/user/Books/BookDetail'
import BookReader from '@/pages/user/Books/BookReader'
import MoviesPage from '@/pages/user/Movies/MoviesPage'
import MovieDetail from '@/pages/user/Movies/MovieDetail'
import MovieWatch from '@/pages/user/Movies/MovieWatch'
import ProfilePage from '@/pages/user/Profile/ProfilePage'
import ReadHistory from '@/pages/user/Profile/ReadHistory'
import WatchHistory from '@/pages/user/Profile/WatchHistory'
import Collections from '@/pages/user/Profile/Collections'
import SearchPage from '@/pages/user/Search/SearchPage'
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
			{/* Public Routes */}
			<Route path="/" element={<HomePage />} />

			{/* Auth Routes */}
			<Route path="/auth">
				<Route path="login" element={<LoginPage />} />
				<Route path="register" element={<RegisterPage />} />
				<Route path="forgot-password" element={<ForgotPasswordPage />} />
				<Route path="verify-otp" element={<VerifyOTPPage />} />
			</Route>

			{/* User Routes - Protected */}
			<Route element={<PrivateRoute />}>
				<Route path="/books">
					<Route index element={<BooksPage />} />
					<Route path=":id" element={<BookDetail />} />
					<Route path=":id/read" element={<BookReader />} />
				</Route>

				<Route path="/movies">
					<Route index element={<MoviesPage />} />
					<Route path=":id" element={<MovieDetail />} />
					<Route path=":id/watch" element={<MovieWatch />} />
				</Route>

				<Route path="/profile">
					<Route index element={<ProfilePage />} />
					<Route path="read-history" element={<ReadHistory />} />
					<Route path="watch-history" element={<WatchHistory />} />
					<Route path="collections" element={<Collections />} />
				</Route>

				<Route path="/search" element={<SearchPage />} />

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

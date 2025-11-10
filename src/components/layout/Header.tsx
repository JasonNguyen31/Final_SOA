import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { Moon, Sun, User, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export const Header = () => {
	const { isAuthenticated, user, logout } = useAuth()
	const { theme, toggleTheme } = useTheme()
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-2">
						<h1 className="text-2xl font-bold text-primary">FinalSOA</h1>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden items-center space-x-6 md:flex">
						<Link to="/books" className="hover:text-primary transition-colors">
							Books
						</Link>
						<Link to="/movies" className="hover:text-primary transition-colors">
							Movies
						</Link>
						<Link to="/premium" className="hover:text-primary transition-colors">
							Premium
						</Link>
					</nav>

					{/* Actions */}
					<div className="flex items-center space-x-4">
						{/* Theme Toggle */}
						<button
							onClick={toggleTheme}
							className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
							aria-label="Toggle theme"
						>
							{theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
						</button>

						{/* Auth Actions */}
						{isAuthenticated ? (
							<div className="flex items-center space-x-2">
								<Link
									to="/profile"
									className="flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
								>
									<User size={20} />
									<span className="hidden md:inline">{user?.name}</span>
								</Link>
								<button
									onClick={logout}
									className="flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
									aria-label="Logout"
								>
									<LogOut size={20} />
								</button>
							</div>
						) : (
							<div className="flex items-center space-x-2">
								<Link
									to="/auth/login"
									className="rounded-lg px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
								>
									Login
								</Link>
								<Link
									to="/auth/register"
									className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark"
								>
									Sign Up
								</Link>
							</div>
						)}

						{/* Mobile Menu Button */}
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="md:hidden rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
							aria-label="Toggle menu"
						>
							<Menu size={24} />
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<nav className="md:hidden border-t py-4">
						<div className="flex flex-col space-y-3">
							<Link
								to="/books"
								className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
								onClick={() => setIsMenuOpen(false)}
							>
								Books
							</Link>
							<Link
								to="/movies"
								className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
								onClick={() => setIsMenuOpen(false)}
							>
								Movies
							</Link>
							<Link
								to="/premium"
								className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
								onClick={() => setIsMenuOpen(false)}
							>
								Premium
							</Link>
						</div>
					</nav>
				)}
			</div>
		</header>
	)
}

export default Header

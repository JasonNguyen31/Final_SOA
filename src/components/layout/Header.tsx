import { Link } from 'react-router-dom'
import { Search, User, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export const Header = () => {
	const [showUserMenu, setShowUserMenu] = useState(false)

	return (
		<header className="sticky top-0 z-50 bg-gray-900 shadow-lg">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{/* Logo Section */}
					<div className="flex items-center space-x-8">
						<Link to="/" className="flex items-center space-x-2">
							<div className="text-orange-500 text-2xl font-bold">
								<span className="text-3xl">7</span>
								<span className="text-white ml-2">ANIME</span>
								<span className="text-orange-500">NETWORK</span>
							</div>
						</Link>

						{/* Main Navigation */}
						<nav className="hidden lg:flex items-center space-x-6">
							<Link 
								to="/" 
								className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
							>
								News
							</Link>
							<div className="relative group">
								<button className="text-gray-300 hover:text-orange-500 transition-colors font-medium flex items-center">
									Anime
									<ChevronDown className="ml-1 h-4 w-4" />
								</button>
								<div className="absolute hidden group-hover:block top-full left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-xl">
									<Link to="/anime/spring" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-orange-500">Spring</Link>
									<Link to="/anime/summer" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-orange-500">Summer</Link>
									<Link to="/anime/fall" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-orange-500">Fall</Link>
									<Link to="/anime/winter" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-orange-500">Winter</Link>
								</div>
							</div>
							<Link 
								to="/reviews" 
								className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
							>
								Reviews
							</Link>
						</nav>
					</div>

					{/* Right Section */}
					<div className="flex items-center space-x-4">
						{/* Search Bar */}
						<div className="hidden md:flex items-center bg-gray-800 rounded-md px-3 py-1.5">
							<input
								type="text"
								placeholder="Search for your favourites"
								className="bg-transparent text-gray-300 placeholder-gray-500 outline-none w-64 text-sm"
							/>
							<Search className="h-4 w-4 text-gray-400 ml-2" />
						</div>

						{/* User Section */}
						<div className="relative">
							<button
								onClick={() => setShowUserMenu(!showUserMenu)}
								className="flex items-center space-x-2 text-gray-300 hover:text-orange-500 transition-colors"
							>
								<span className="text-sm">Hello, Oneesama</span>
								<ChevronDown className="h-4 w-4" />
								<div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
									<User className="h-5 w-5 text-white" />
								</div>
							</button>
							
							{showUserMenu && (
								<div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-xl">
									<Link to="/profile" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-orange-500">Profile</Link>
									<Link to="/watchlist" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-orange-500">Watchlist</Link>
									<Link to="/settings" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-orange-500">Settings</Link>
									<hr className="border-gray-700 my-1" />
									<button className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-orange-500">Logout</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
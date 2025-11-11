import { Search, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import '@/styles/Header.css'
import logoCoverImage from '@/assets/images/imagecoverheader.jpg'

export const Header = () => {
	const [showUserMenu, setShowUserMenu] = useState(false)
	const [showMoviesMenu, setShowMoviesMenu] = useState(false)
	const [showBooksMenu, setShowBooksMenu] = useState(false)

	return (
		<header className="header">
			<div className="header-container">
				<div className="header-content">
					{/* Left Section - Logo with Background */}
					<div className="header-left">
						<div className="logo-wrapper">
							<a href="/" className="logo">
								<div className="logo-text-group">
									<div className="logo-main">
										<span className="logo-text">GENZ</span>
										<span className="logo-network">MOBO</span>
									</div>
									<span className="logo-japanese">映画と本の閲覧ウェブサイト</span>
								</div>
							</a>
							{/* Background Image Below Logo */}
							<div className="logo-background">
								<img src={logoCoverImage} alt="background" />
							</div>
						</div>
					</div>

					{/* Right Section - Navigation & User */}
					<div className="header-right">
						{/* Main Navigation */}
						<nav className="main-nav">
							<a href="/" className="nav-link">
								Home
							</a>

							<div
								className="nav-dropdown"
								onMouseEnter={() => setShowMoviesMenu(true)}
								onMouseLeave={() => setShowMoviesMenu(false)}
							>
								<button className="nav-link">
									Movies
									<ChevronDown className="nav-icon" />
								</button>
								{showMoviesMenu && (
									<div className="dropdown-menu">
										<a href="/movies/action" className="dropdown-item">Action</a>
										<a href="/movies/comedy" className="dropdown-item">Comedy</a>
										<a href="/movies/drama" className="dropdown-item">Drama</a>
										<a href="/movies/romance" className="dropdown-item">Romance</a>
									</div>
								)}
							</div>

							<div
								className="nav-dropdown"
								onMouseEnter={() => setShowBooksMenu(true)}
								onMouseLeave={() => setShowBooksMenu(false)}
							>
								<button className="nav-link">
									Books
									<ChevronDown className="nav-icon" />
								</button>
								{showBooksMenu && (
									<div className="dropdown-menu">
										<a href="/books/manga" className="dropdown-item">Manga</a>
										<a href="/books/light-novel" className="dropdown-item">Light Novel</a>
										<a href="/books/artbook" className="dropdown-item">Artbook</a>
									</div>
								)}
							</div>

							<a href="/news" className="nav-link">
								News
							</a>
						</nav>

						{/* Search Bar */}
						<div className="search-box">
							<input
								type="text"
								placeholder="Search for your fave anime"
								className="search-input"
							/>
							<Search className="search-icon" />
						</div>

						{/* User Section with Active Dot */}
						<div className="user-section">
							<button
								onClick={() => setShowUserMenu(!showUserMenu)}
								className="user-button"
							>
								<span className="user-greeting">Hello, <strong>Jason sama</strong></span>
								<ChevronDown className="user-icon" />
							</button>

							{/* User Avatar - Tách ra ngoài button */}
							<div className="user-avatar">
								<div className="avatar-circle"></div>
								<span className="active-dot"></span>
							</div>

							{showUserMenu && (
								<div className="user-menu">
									<a href="/profile" className="user-menu-item">Profile</a>
									<a href="/watchlist" className="user-menu-item">Watchlist</a>
									<a href="/settings" className="user-menu-item">Settings</a>
									<hr className="user-menu-divider" />
									<button className="user-menu-item">Logout</button>
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
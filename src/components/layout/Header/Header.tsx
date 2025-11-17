import { ChevronDown, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useAuth as useAuthHook } from '@/hooks/useAuth'
import { useSearch } from '@/context/SearchContext'
import { ProfileModal } from '@/components/common/Modal/ProfileModal'
import { WalletModal } from '@/components/common/Modal/WalletModal'
import { PremiumServiceModal } from '@/components/common/Modal/PremiumServiceModal'
import { CollectionModal } from '@/components/common/Modal/CollectionModal'
import { WatchingHistoryModal } from '@/components/common/Modal/WatchingHistoryModal'
import { ReadingHistoryModal } from '@/components/common/Modal/ReadingHistoryModal'
import { NotificationCenterModal } from '@/components/common/Modal/NotificationCenterModal'
import { movieService } from '@/services/content/movieService'
import { SearchBox } from '@/components/search/SearchBox'
import '@/styles/Header.css'
import logoCoverImage from '@/assets/images/header-logo.jpg'

export const Header = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { user } = useAuth()
	const { logout } = useAuthHook()
	const { searchQuery, setSearchQuery } = useSearch()
	const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
	const [showUserMenu, setShowUserMenu] = useState(false)
	const [showMoviesMenu, setShowMoviesMenu] = useState(false)
	const [showBooksMenu, setShowBooksMenu] = useState(false)
	const [genres, setGenres] = useState<string[]>([])
	const [showNotifications, setShowNotifications] = useState(false)
	const [showNotificationModal, setShowNotificationModal] = useState(false)
	const [selectedNotification, setSelectedNotification] = useState<number | null>(null)
	const [hoverMovies, setHoverMovies] = useState(false)
	const [hoverBooks, setHoverBooks] = useState(false)
	const [moviesClickLocked, setMoviesClickLocked] = useState(false)
	const [booksClickLocked, setBooksClickLocked] = useState(false)
	const [userClickLocked, setUserClickLocked] = useState(false)
	const [showProfileModal, setShowProfileModal] = useState(false)
	const [showWalletModal, setShowWalletModal] = useState(false)
	const [showPremiumServiceModal, setShowPremiumServiceModal] = useState(false)
	const [showCollectionModal, setShowCollectionModal] = useState(false)
	const [showWatchingHistoryModal, setShowWatchingHistoryModal] = useState(false)
	const [showReadingHistoryModal, setShowReadingHistoryModal] = useState(false)

	// Mock notifications data
	const notifications = [
		{
			id: 1,
			title: 'New episode released',
			message: 'Attack on Titan Season 4 Episode 28',
			time: '2 hours ago',
			unread: true,
			fullContent: 'The final season continues! Attack on Titan Season 4 Episode 28 "The Dawn of Humanity" is now available to watch. Eren\'s plan unfolds as the Survey Corps faces their greatest challenge yet. Don\'t miss this epic episode!'
		},
		{
			id: 2,
			title: 'Watchlist update',
			message: 'Demon Slayer has been added to your watchlist',
			time: '5 hours ago',
			unread: true,
			fullContent: 'Great choice! Demon Slayer: Kimetsu no Yaiba has been successfully added to your watchlist. Follow Tanjiro\'s journey as he becomes a demon slayer to avenge his family and cure his sister Nezuko. The anime features stunning animation by ufotable and an incredible soundtrack.'
		},
		{
			id: 3,
			title: 'Comment reply',
			message: 'Someone replied to your comment',
			time: '1 day ago',
			unread: false,
			fullContent: '@user_anime_fan replied to your comment on "One Piece Episode 1000 Discussion": "I totally agree with your analysis! The animation quality in this episode was phenomenal. Oda-sensei really knows how to deliver these milestone episodes!"'
		},
		{
			id: 4,
			title: 'New recommendation',
			message: 'Check out Jujutsu Kaisen',
			time: '2 days ago',
			unread: false,
			fullContent: 'Based on your viewing history, we think you\'ll love Jujutsu Kaisen! This supernatural action anime follows Yuji Itadori as he joins a secret organization of Jujutsu Sorcerers to eliminate curses and save people. With intense battles, compelling characters, and dark themes, it\'s perfect for fans of action-packed shounen anime.'
		},
	]

	const unreadCount = notifications.filter(n => n.unread).length

	const isActive = (path: string) => {
		return location.pathname === path || location.pathname.startsWith(path + '/')
	}

	const isPremium = true

	// Handle logout
	const handleLogout = async () => {
		try {
			await logout()
			// Force redirect to landing page using window.location
			// This ensures complete page reload and prevents routing issues
			window.location.href = '/'
		} catch (error) {
			console.error('Logout failed:', error)
			// Even if logout fails on server, still redirect to landing
			window.location.href = '/'
		}
	}

	// Fetch genres on mount
	useEffect(() => {
		const fetchGenres = async () => {
			try {
				const fetchedGenres = await movieService.getGenres()
				setGenres(fetchedGenres)
			} catch (error) {
				console.error('Error fetching genres:', error)
			}
		}
		fetchGenres()
	}, [])

	// Handle clicks outside dropdowns
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement

			// Check if click is outside all dropdowns
			if (!target.closest('.nav-dropdown') &&
				!target.closest('.user-section') &&
				!target.closest('.notifications-wrapper')) {
				if (moviesClickLocked) {
					setShowMoviesMenu(false)
					setMoviesClickLocked(false)
				}
				if (booksClickLocked) {
					setShowBooksMenu(false)
					setBooksClickLocked(false)
				}
				if (userClickLocked) {
					setShowUserMenu(false)
					setUserClickLocked(false)
				}
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [moviesClickLocked, booksClickLocked, userClickLocked])

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
							<a href="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
								<strong> Home </strong>
							</a>

							<div
								className="nav-dropdown"
								onMouseEnter={() => {
									if (!moviesClickLocked) {
										setShowMoviesMenu(true)
										setShowBooksMenu(false)
										setShowUserMenu(false)
										setShowNotifications(false)
										setBooksClickLocked(false)
										setUserClickLocked(false)
									}
									setHoverMovies(true)
								}}
								onMouseLeave={() => {
									if (!moviesClickLocked) {
										setShowMoviesMenu(false)
									}
									setHoverMovies(false)
								}}
							>
								<button
									className={`nav-link ${isActive('/movies') ? 'active' : ''} ${hoverMovies || showMoviesMenu ? 'hovered' : ''}`}
									onClick={() => {
										if (moviesClickLocked) {
											setShowMoviesMenu(false)
											setMoviesClickLocked(false)
										} else {
											setShowMoviesMenu(true)
											setMoviesClickLocked(true)
											setShowBooksMenu(false)
											setShowUserMenu(false)
											setShowNotifications(false)
											setBooksClickLocked(false)
											setUserClickLocked(false)
										}
									}}
								>
									<strong> Movies </strong>
									<ChevronDown className="nav-icon" />
								</button>
								{showMoviesMenu && (
									<div className="dropdown-menu genres-dropdown">
										{genres.map((genre) => (
											<a
												key={genre}
												href={`/home?genre=${encodeURIComponent(genre)}`}
												className="dropdown-item"
											>
												{genre}
											</a>
										))}
									</div>
								)}
							</div>

							<div
								className="nav-dropdown"
								onMouseEnter={() => {
									if (!booksClickLocked) {
										setShowBooksMenu(true)
										setShowMoviesMenu(false)
										setShowUserMenu(false)
										setShowNotifications(false)
										setMoviesClickLocked(false)
										setUserClickLocked(false)
									}
									setHoverBooks(true)
								}}
								onMouseLeave={() => {
									if (!booksClickLocked) {
										setShowBooksMenu(false)
									}
									setHoverBooks(false)
								}}
							>
								<button
									className={`nav-link ${isActive('/books') ? 'active' : ''} ${hoverBooks || showBooksMenu ? 'hovered' : ''}`}
									onClick={() => {
										if (booksClickLocked) {
											setShowBooksMenu(false)
											setBooksClickLocked(false)
										} else {
											setShowBooksMenu(true)
											setBooksClickLocked(true)
											setShowMoviesMenu(false)
											setShowUserMenu(false)
											setShowNotifications(false)
											setMoviesClickLocked(false)
											setUserClickLocked(false)
										}
									}}
								>
									<strong> Books </strong>
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

							<a href="/news" className={`nav-link ${isActive('/news') ? 'active' : ''}`}>
								<strong> News </strong>
							</a>
						</nav>

						{/* Search Bar */}
					<SearchBox placeholder="Search movies, anime, books..." />

						{/* User Section with Active Dot */}
						<div className="user-section">
							<button
								className={`user-button ${showUserMenu ? 'active' : ''}`}
								onClick={() => {
									if (userClickLocked) {
										setShowUserMenu(false)
										setUserClickLocked(false)
									} else {
										setShowUserMenu(true)
										setUserClickLocked(true)
										setShowMoviesMenu(false)
										setShowBooksMenu(false)
										setShowNotifications(false)
										setMoviesClickLocked(false)
										setBooksClickLocked(false)
									}
								}}
								onMouseEnter={() => {
									if (!userClickLocked) {
										setShowUserMenu(true)
										setShowMoviesMenu(false)
										setShowBooksMenu(false)
										setShowNotifications(false)
										setMoviesClickLocked(false)
										setBooksClickLocked(false)
									}
								}}
								onMouseLeave={() => {
									if (!userClickLocked) {
										setShowUserMenu(false)
									}
								}}
							>
								<div className="user-greeting-wrapper">
									<span className="user-greeting">
										<strong>Hello, {user?.displayName || user?.username || 'User'}</strong>
									</span>
									{user?.isPremium ? (
										<span className="premium-badge">Premium Account</span>
									) : (
										<span className="classic-badge">Classic</span>
									)}
								</div>
								<ChevronDown className="user-icon" />
							</button>

							{/* Notifications - Đặt giữa user-button và user-avatar */}
							<div className="notifications-wrapper">
								<button
									className="notifications-button"
									onClick={() => {
										setShowNotificationModal(!showNotificationModal)
										setShowMoviesMenu(false)
										setShowBooksMenu(false)
										setShowUserMenu(false)
										setShowNotifications(false)
									}}
								>
									<Bell className="notifications-icon" />
									{unreadCount > 0 && (
										<span className="notifications-badge">{unreadCount}</span>
									)}
								</button>

								{showNotifications && !showNotificationModal && (
									<div
										className="notifications-dropdown"
										onMouseLeave={() => {
											setShowNotifications(false)
											setSelectedNotification(null)
										}}
									>
										{selectedNotification === null ? (
											<>
												<div className="notifications-header">
													<h3 className="notifications-title">Notifications</h3>
													<span className="notifications-count">{unreadCount} new</span>
												</div>
												<div className="notifications-list">
													{notifications.map((notification) => (
														<div
															key={notification.id}
															className={`notification-item ${notification.unread ? 'unread' : ''}`}
															onClick={() => setSelectedNotification(notification.id)}
														>
															<div className="notification-content">
																<h4 className="notification-title">{notification.title}</h4>
																<p className="notification-message">{notification.message}</p>
																<span className="notification-time">{notification.time}</span>
															</div>
															{notification.unread && <span className="notification-dot"></span>}
														</div>
													))}
												</div>
												<a href="/notifications" className="notifications-view-all">
													View all notifications
												</a>
											</>
										) : (
											<>
												<div className="notifications-header">
													<button
														className="notification-back-btn"
														onClick={() => setSelectedNotification(null)}
													>
														← Back
													</button>
													<h3 className="notifications-title">Notification Details</h3>
												</div>
												<div className="notification-detail">
													{notifications.find(n => n.id === selectedNotification) && (
														<>
															<h3 className="notification-detail-title">
																{notifications.find(n => n.id === selectedNotification)!.title}
															</h3>
															<span className="notification-detail-time">
																{notifications.find(n => n.id === selectedNotification)!.time}
															</span>
															<p className="notification-detail-content">
																{notifications.find(n => n.id === selectedNotification)!.fullContent}
															</p>
														</>
													)}
												</div>
											</>
										)}
									</div>
								)}
							</div>

							{/* User Avatar */}
							<div className="user-avatar">
								{user?.avatar ? (
									<img src={user.avatar} alt="Avatar" className="avatar-image" />
								) : (
									<div className="avatar-circle"></div>
								)}
								<span className="active-dot"></span>
							</div>

							{showUserMenu && (
								<div
									className="user-menu"
									onMouseEnter={() => {
										if (!userClickLocked) {
											setShowUserMenu(true)
										}
									}}
									onMouseLeave={() => {
										if (!userClickLocked) {
											setShowUserMenu(false)
										}
									}}
								>
									<button
										className="user-menu-item"
										onClick={() => {
											setShowProfileModal(true)
											setShowUserMenu(false)
											setUserClickLocked(false)
										}}
									>
										Profile
									</button>
									<button
										className="user-menu-item"
										onClick={() => {
											setShowWalletModal(true)
											setShowUserMenu(false)
											setUserClickLocked(false)
										}}
									>
										Wallet
									</button>
									<button
										className="user-menu-item"
										onClick={() => {
											setShowPremiumServiceModal(true)
											setShowUserMenu(false)
											setUserClickLocked(false)
										}}
									>
										Premium Service
									</button>
									<button
										className="user-menu-item"
										onClick={() => {
											setShowCollectionModal(true)
											setShowUserMenu(false)
											setUserClickLocked(false)
										}}
									>
										Collection
									</button>
									<button
										className="user-menu-item"
										onClick={() => {
											setShowWatchingHistoryModal(true)
											setShowUserMenu(false)
											setUserClickLocked(false)
										}}
									>
										Watching History
									</button>
									<button
										className="user-menu-item"
										onClick={() => {
											setShowReadingHistoryModal(true)
											setShowUserMenu(false)
											setUserClickLocked(false)
										}}
									>
										Reading History
									</button>
									<hr className="user-menu-divider" />
									<button className="user-menu-item" onClick={handleLogout}>Logout</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Modals */}
			<NotificationCenterModal isOpen={showNotificationModal} onClose={() => setShowNotificationModal(false)} />
		<ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
			<WalletModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />
			<PremiumServiceModal isOpen={showPremiumServiceModal} onClose={() => setShowPremiumServiceModal(false)} />
			<CollectionModal isOpen={showCollectionModal} onClose={() => setShowCollectionModal(false)} />
			<WatchingHistoryModal isOpen={showWatchingHistoryModal} onClose={() => setShowWatchingHistoryModal(false)} />
			<ReadingHistoryModal isOpen={showReadingHistoryModal} onClose={() => setShowReadingHistoryModal(false)} />
		</header>
	)
}

export default Header
import { X, ArrowLeft } from 'lucide-react'
import '@/styles/ContentGrid.css'
import contentGridBg from '@/assets/images/xza.jpg'
import { useState, useEffect, useMemo } from 'react'
import { ContentCard } from '../ContentCard/ContentCard'
import { ContentFilters } from '../ContentFilters/ContentFilters'
import { Pagination } from '../Pagination/Pagination'
import { ContentSidebar } from '../ContentSidebar/ContentSidebar'
import { useMovies } from '@/hooks/useMovies'
import { useSearch } from '@/context/SearchContext'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'

type TabType = 'movies' | 'anime' | 'books'
type ModalContentType = 'episodes' | 'anime-week' | 'videos'

export const ContentGrid = () => {
	const { searchQuery, clearSearch, isSearchActive } = useSearch()
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const location = useLocation()
	const [currentPage, setCurrentPage] = useState(1)
	const [activeTab, setActiveTab] = useState<TabType>('movies')
	const [showModal, setShowModal] = useState(false)
	const [modalContent, setModalContent] = useState<ModalContentType>('episodes')

	// Get genre from URL params
	const selectedGenre = searchParams.get('genre')
	console.log('[ContentGrid] Selected genre:', selectedGenre)
	console.log('[ContentGrid] URL search params:', location.search)

	// Build query params based on active tab, search, or genre
	const queryParams = useMemo(() => {
		const params: any = {
			page: currentPage,
			limit: 16,
			sortBy: 'releaseYear',
			order: 'desc'
		}

		// If filtering by genre, include genre and show all types (movies + anime)
		if (selectedGenre) {
			params.genre = selectedGenre
			// Don't filter by type when showing genre - show both movies and anime
		}
		// If searching, use search query instead of tab filtering
		else if (isSearchActive) {
			params.search = searchQuery
			// Don't filter by type when searching, show all results
		}
		// Normal tab filtering
		else {
			switch (activeTab) {
				case 'movies':
					// Filter for movies (type = 'movie')
					params.type = 'movie'
					break
				case 'anime':
					// Filter for anime (type = 'anime')
					params.type = 'anime'
					break
				case 'books':
					// For now, show empty for books until bookService is integrated
					return null
			}
		}

		console.log('[ContentGrid] Query params:', params)
		return params
	}, [currentPage, activeTab, searchQuery, isSearchActive, selectedGenre])

	// Fetch movies using the hook
	const { movies, loading, error, pagination } = useMovies(queryParams)

	// Get current items to display
	const currentItems = useMemo(() => {
		if (activeTab === 'books') {
			// For books, return empty array for now
			return []
		}
		return movies
	}, [movies, activeTab])

	// Reset page when tab changes, search query changes, or genre changes
	useEffect(() => {
		setCurrentPage(1)
	}, [activeTab, searchQuery, selectedGenre])

	// Auto-scroll to content grid when genre is selected
	useEffect(() => {
		if (selectedGenre) {
			// Wait for content to render, then scroll
			setTimeout(() => {
				const wrapper = document.querySelector('.content-grid-wrapper')
				if (wrapper) {
					const headerHeight = 80 // Adjust based on your header height
					const wrapperPosition = wrapper.getBoundingClientRect().top + window.pageYOffset

					window.scrollTo({
						top: wrapperPosition - headerHeight,
						behavior: 'smooth'
					})
				}
			}, 100)
		}
	}, [selectedGenre])

	// Handle back from genre view
	const handleBackFromGenre = () => {
		// Navigate to current page without genre param
		const currentPath = location.pathname
		navigate(currentPath)
	}

	// Disable scroll when modal is open
	useEffect(() => {
		if (showModal) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'auto'
		}

		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [showModal])

	const handlePageChange = (page: number) => {
		setCurrentPage(page)

		// Scroll to content grid when pagination changes
		const wrapper = document.querySelector('.content-grid-wrapper')
		if (wrapper) {
			const headerHeight = 40
			const wrapperPosition = wrapper.getBoundingClientRect().top + window.pageYOffset

			window.scrollTo({
				top: wrapperPosition - headerHeight,
				behavior: 'smooth'
			})
		}
	}

	const handleTabChange = (tab: TabType) => {
		setActiveTab(tab)
	}

	const handleOpenModal = (content: ModalContentType) => {
		setModalContent(content)
		setShowModal(true)
	}

	const handleCloseModal = () => {
		setShowModal(false)
	}

	return (
		<div className="content-grid-wrapper">
			<div className="content-grid-background">
				<img src={contentGridBg} alt="content grid background" />
			</div>
			<div className="content-grid-container">
				{/* LEFT SECTION - Main Content */}
				<div className="content-main">
					{/* Genre Header with Back Button */}
					{selectedGenre && !isSearchActive && (
						<div className="search-results-header">
							<button onClick={handleBackFromGenre} className="back-button">
								<ArrowLeft className="back-icon" />
								<span>Back to Browse</span>
							</button>
							<h2 className="search-results-title">
								{selectedGenre} ({pagination.totalItems || 0} titles)
							</h2>
						</div>
					)}

					{/* Search Results Header with Back Button */}
					{isSearchActive && (
						<div className="search-results-header">
							<button onClick={clearSearch} className="back-button">
								<ArrowLeft className="back-icon" />
								<span>Back to Browse</span>
							</button>
							<h2 className="search-results-title">
								Search results for "{searchQuery}" ({pagination.totalItems || 0} found)
							</h2>
						</div>
					)}

					{/* Tabs/Filters - Hide when searching or filtering by genre */}
					{!isSearchActive && !selectedGenre && <ContentFilters activeTab={activeTab} onTabChange={handleTabChange} />}

					{/* Loading State */}
					{loading && (
						<div className="content-loading">
							<p>Loading content...</p>
						</div>
					)}

					{/* Error State */}
					{error && !loading && (
						<div className="content-error">
							<p className="error-message">{error}</p>
							<button onClick={() => window.location.reload()} className="retry-button">
								Retry
							</button>
						</div>
					)}

					{/* Empty State for Books */}
					{activeTab === 'books' && !loading && (
						<div className="content-empty">
							<p>Books section coming soon!</p>
						</div>
					)}

					{/* Content Cards Grid */}
					{!loading && !error && activeTab !== 'books' && (
						<>
							<div className="content-cards">
								{currentItems.map((content) => (
									<ContentCard key={content.id} content={content} />
								))}
							</div>

							{/* Pagination */}
							{currentItems.length > 0 && (
								<Pagination
									currentPage={pagination.currentPage}
									totalPages={pagination.totalPages}
									onPageChange={handlePageChange}
								/>
							)}
						</>
					)}
				</div>

				{/* RIGHT SECTION - Sidebar */}
				<ContentSidebar onOpenModal={handleOpenModal} />
			</div>

			{/* Modal */}
			{showModal && (
				<div className="content-modal-overlay" onClick={handleCloseModal}>
					<div className="content-modal-container" onClick={(e) => e.stopPropagation()}>
						<button className="content-modal-close" onClick={handleCloseModal}>
							<X className="close-icon" />
						</button>

						<div className="content-modal-content">
							{modalContent === 'episodes' && (
								<>
									<h2 className="content-modal-title">All Recent Episodes</h2>
									<div className="content-modal-grid">
										<p className="content-modal-empty">No episodes available</p>
									</div>
								</>
							)}

							{modalContent === 'anime-week' && (
								<>
									<h2 className="content-modal-title">Previous Anime of the Week</h2>
									<div className="content-modal-grid">
										<p className="content-modal-empty">No previous anime available</p>
									</div>
								</>
							)}

							{modalContent === 'videos' && (
								<>
									<h2 className="content-modal-title">All Recent Videos</h2>
									<div className="content-modal-grid">
										<p className="content-modal-empty">No videos available</p>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default ContentGrid

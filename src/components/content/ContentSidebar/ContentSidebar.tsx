import { Link } from 'react-router-dom'
import { Star, Plus, Play } from 'lucide-react'
import { useState, useEffect } from 'react'
import { movieService, type Movie } from '@/services/content/movieService'

interface ContentSidebarProps {
	onOpenModal: (content: 'episodes' | 'anime-week' | 'videos') => void
}

export const ContentSidebar: React.FC<ContentSidebarProps> = ({ onOpenModal }) => {
	const [sidebarTab, setSidebarTab] = useState<'recent' | 'recommended'>('recent')
	const [recentWatching, setRecentWatching] = useState<Movie[]>([])
	const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([])
	const [movieOfWeek, setMovieOfWeek] = useState<Movie | null>(null)
	const [loading, setLoading] = useState(true)

	// Fetch data from API
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const [recent, recommended, movieWeek] = await Promise.all([
					movieService.getWatchHistory().then(async () => {
						// getWatchHistory returns WatchProgress[], we need to get full movie data
						try {
							return await movieService.getContinueWatching()
						} catch {
							return []
						}
					}),
					movieService.getRecommendedMovies(5),
					movieService.getMovieOfTheWeek()
				])

				setRecentWatching(recent)
				setRecommendedMovies(recommended)
				setMovieOfWeek(movieWeek)
			} catch (error) {
				console.error('Failed to fetch sidebar data:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	const renderStars = (rating: number) => {
		return [...Array(5)].map((_, i) => (
			<Star
				key={i}
				className={`rating-star ${i < Math.floor(rating) ? 'filled' : 'empty'}`}
			/>
		))
	}

	const currentMovies = sidebarTab === 'recent' ? recentWatching : recommendedMovies

	const renderRating = (movie: Movie) => {
		const rating = movie.totalRatings && movie.totalRatings > 0 ? movie.totalRatings / 20 : 3
		return Math.min(Math.max(rating, 0), 5)
	}

	return (
		<aside className="content-sidebar">
			{/* Recent Watching */}
			<div className="sidebar-section">
				<div className="sidebar-header">
					<h3 className="sidebar-title">Recent Watching</h3>
					<button
						onClick={() => onOpenModal('episodes')}
						className="sidebar-link-button"
					>
						View all
					</button>
				</div>

				<div className="sidebar-tabs">
					<button
						onClick={() => setSidebarTab('recent')}
						className={`sidebar-tab ${sidebarTab === 'recent' ? 'active' : ''}`}
					>
						History
					</button>
					<button
						onClick={() => setSidebarTab('recommended')}
						className={`sidebar-tab ${sidebarTab === 'recommended' ? 'active' : ''}`}
					>
						Recommended
					</button>
				</div>

				<div className="sidebar-list">
					{!loading && currentMovies.length > 0 ? (
						currentMovies.map((movie: Movie) => (
							<Link key={movie.id} to={`/movies/${movie.id}/watch`} className="sidebar-item">
								<img src={movie.thumbnailUrl || '/placeholder.jpg'} alt={movie.title} className="sidebar-item-image" />
								<div className="sidebar-item-info">
									<h4 className="sidebar-item-title">{movie.title}</h4>
									<p className="sidebar-item-subtitle">{movie.genres?.join(', ') || 'N/A'}</p>
									<span className="sidebar-item-views">{movie.viewCount || 0} views</span>
								</div>
							</Link>
						))
					) : loading ? (
						<div className="sidebar-empty">Loading...</div>
					) : (
						<div className="sidebar-empty">No movies available</div>
					)}
				</div>
			</div>

			{/* Movie of the Week */}
			<div className="sidebar-section">
				<div className="sidebar-header">
					<h3 className="sidebar-title">Movie of the Week</h3>
					<button
						onClick={() => onOpenModal('anime-week')}
						className="sidebar-link-button"
					>
						View previous
					</button>
				</div>

				{!loading && movieOfWeek ? (
					<div className="anime-week-card">
						<img src={movieOfWeek.thumbnailUrl || '/placeholder.jpg'} alt={movieOfWeek.title} className="anime-week-image" />
						<div className="anime-week-info">
							<p className="anime-week-genre">{movieOfWeek.genres?.slice(0, 2).join(', ') || 'N/A'}</p>
							<h4 className="anime-week-title">{movieOfWeek.title}</h4>
							<div className="anime-week-rating">
								<div className="rating-stars">{renderStars(renderRating(movieOfWeek))}</div>
								<span className="rating-text">({movieOfWeek.totalRatings || 0} reviews)</span>
							</div>
							<div className="anime-week-details">
								<div className="anime-week-detail">
									<span className="anime-week-detail-label">Release year:</span>
									<span>{movieOfWeek.releaseYear || 'N/A'}</span>
								</div>
								<div className="anime-week-detail">
									<span className="anime-week-detail-label">Views:</span>
									<span>{movieOfWeek.viewCount || 0}</span>
								</div>
								<div className="anime-week-detail">
									<span className="anime-week-detail-label">Duration:</span>
									<span>{movieOfWeek.duration || 'N/A'} min</span>
								</div>
							</div>
							<div className="anime-week-stats">
								<div className="anime-week-stat">
									<div className="anime-week-stat-value">{movieOfWeek.viewCount || 0}</div>
									<div className="anime-week-stat-label">Views</div>
								</div>
								<div className="anime-week-stat">
									<div className="anime-week-stat-value">{movieOfWeek.totalRatings || 0}</div>
									<div className="anime-week-stat-label">Ratings</div>
								</div>
							</div>
							<Link to={`/movies/${movieOfWeek.id}/watch`} className="anime-week-button">
								<Play className="h-5 w-5" />
								Watch Now
							</Link>
						</div>
					</div>
				) : (
					<div className="sidebar-empty">Loading movie of the week...</div>
				)}
			</div>

		</aside>
	)
}

export default ContentSidebar

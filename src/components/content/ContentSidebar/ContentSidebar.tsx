import { Link } from 'react-router-dom'
import { Star, Plus, Play, MessageSquare } from 'lucide-react'
import { useState } from 'react'

interface ContentSidebarProps {
	onOpenModal: (content: 'episodes' | 'anime-week' | 'videos') => void
}

interface SidebarItem {
	id: string
	title: string
	subtitle: string
	image: string
	views: string
}

interface VideoItem {
	id: string
	title: string
	thumbnail: string
	views: string
	comments: number
	date: string
	duration: string
}

export const ContentSidebar: React.FC<ContentSidebarProps> = ({ onOpenModal }) => {
	const [sidebarTab, setSidebarTab] = useState<'recent' | 'recommended'>('recent')
	// Empty arrays - data will come from API
	const recentEpisodes: SidebarItem[] = []
	const recommendedEpisodes: SidebarItem[] = []
	const recentVideos: VideoItem[] = []

	const renderStars = (rating: number) => {
		return [...Array(5)].map((_, i) => (
			<Star
				key={i}
				className={`rating-star ${i < Math.floor(rating) ? 'filled' : 'empty'}`}
			/>
		))
	}

	const currentSidebarEpisodes = sidebarTab === 'recent' ? recentEpisodes : recommendedEpisodes

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
					{currentSidebarEpisodes.length > 0 ? (
						currentSidebarEpisodes.map((item: SidebarItem) => (
							<Link key={item.id} to={`/episode/${item.id}`} className="sidebar-item">
								<img src={item.image} alt={item.title} className="sidebar-item-image" />
								<div className="sidebar-item-info">
									<h4 className="sidebar-item-title">{item.title}</h4>
									<p className="sidebar-item-subtitle">{item.subtitle}</p>
									<span className="sidebar-item-views">{item.views}</span>
								</div>
							</Link>
						))
					) : (
						<div className="sidebar-empty">No episodes available</div>
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

				<div className="anime-week-card">
					<img src="/images/captain-earth.jpg" alt="Captain Earth" className="anime-week-image" />
					<div className="anime-week-info">
						<p className="anime-week-genre">Action, Adventure</p>
						<h4 className="anime-week-title">Captain Earth</h4>
						<div className="anime-week-rating">
							<div className="rating-stars">{renderStars(4)}</div>
							<span className="rating-text">(94 reviews)</span>
						</div>
						<div className="anime-week-details">
							<div className="anime-week-detail">
								<span className="anime-week-detail-label">Status:</span>
								<span>On going</span>
							</div>
							<div className="anime-week-detail">
								<span className="anime-week-detail-label">Release year:</span>
								<span>2014</span>
							</div>
							<div className="anime-week-detail">
								<span className="anime-week-detail-label">Producer:</span>
								<span>Toei Animation</span>
							</div>
							<div className="anime-week-detail">
								<span className="anime-week-detail-label">Duration:</span>
								<span>24min. per episode</span>
							</div>
						</div>
						<div className="anime-week-stats">
							<div className="anime-week-stat">
								<div className="anime-week-stat-value">75</div>
								<div className="anime-week-stat-label">Watching</div>
							</div>
							<div className="anime-week-stat">
								<div className="anime-week-stat-value">23</div>
								<div className="anime-week-stat-label">Episodes</div>
							</div>
						</div>
						<button className="anime-week-button">
							<Plus className="h-5 w-5" />
							Start following
						</button>
					</div>
				</div>
			</div>

		</aside>
	)
}

export default ContentSidebar

import { Link } from 'react-router-dom'
import { Star, Check, Plus, Play, MessageSquare } from 'lucide-react'
import '@/styles/ContentGrid.css'
import contentGridBg from '@/assets/images/xza.jpg'
import { useMemo, useState } from 'react'

interface ContentCard {
	id: number
	title: string
	subtitle?: string
	image: string
	rating: number
	reviews: number
	episodes: number
	watching: number
	type: string
	season: string
	isSpecial?: boolean
	hasCheckmark?: boolean
}

interface SidebarItem {
	id: number
	title: string
	subtitle: string
	image: string
	views: string
}

interface VideoItem {
	id: number
	title: string
	thumbnail: string
	views: string
	comments: number
	date: string
	duration: string
}

export const ContentGrid = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 16

	const allContentList: ContentCard[] = [
		{
			id: 1,
			title: "Samurai Flamenco",
			image: "/images/samurai-flamenco.jpg",
			rating: 4.5,
			reviews: 12,
			episodes: 23,
			watching: 561,
			type: 'Drama, Comedy',
			season: 'Spring',
			hasCheckmark: true
		},
		{
			id: 2,
			title: "Strike the Blood",
			subtitle: "ストライク・ザ・ブラッド",
			image: "/images/strike-blood.jpg",
			rating: 3.5,
			reviews: 42,
			episodes: 13,
			watching: 341,
			type: 'Action, Adventure',
			season: 'Summer',
			hasCheckmark: true
		},
		{
			id: 3,
			title: "World Conquest Zvezda",
			subtitle: "征服",
			image: "/images/world-conquest.jpg",
			rating: 4.0,
			reviews: 21,
			episodes: 16,
			watching: 171,
			type: 'Fantasy, Science Fiction',
			season: 'Fall',
			isSpecial: true
		},
		{
			id: 4,
			title: "Black Bullet",
			subtitle: "ブラック・ブレット",
			image: "/images/black-bullet.jpg",
			rating: 4.5,
			reviews: 87,
			episodes: 15,
			watching: 672,
			type: 'Action, Adventure',
			season: 'Winter'
		},
		// Thêm 16 items nữa để đủ 20 cho trang 1
		{
			id: 5,
			title: "Tokyo Ghoul",
			subtitle: "東京喰種",
			image: "/images/tokyo-ghoul.jpg",
			rating: 4.8,
			reviews: 156,
			episodes: 12,
			watching: 892,
			type: 'Action, Horror',
			season: 'Summer',
			hasCheckmark: true
		},
		{
			id: 6,
			title: "One Punch Man",
			subtitle: "ワンパンマン",
			image: "/images/opm.jpg",
			rating: 5.0,
			reviews: 234,
			episodes: 24,
			watching: 1203,
			type: 'Action, Comedy',
			season: 'Fall',
			hasCheckmark: true
		},
		{
			id: 7,
			title: "Demon Slayer",
			subtitle: "鬼滅の刃",
			image: "/images/demon-slayer.jpg",
			rating: 4.9,
			reviews: 301,
			episodes: 26,
			watching: 1456,
			type: 'Action, Adventure',
			season: 'Spring',
			hasCheckmark: true
		},
		{
			id: 8,
			title: "My Hero Academia",
			subtitle: "僕のヒーローアカデミア",
			image: "/images/mha.jpg",
			rating: 4.7,
			reviews: 198,
			episodes: 25,
			watching: 987,
			type: 'Action, Shounen',
			season: 'Spring'
		},
		{
			id: 9,
			title: "Attack on Titan",
			subtitle: "進撃の巨人",
			image: "/images/aot.jpg",
			rating: 4.9,
			reviews: 412,
			episodes: 75,
			watching: 2134,
			type: 'Action, Drama',
			season: 'Spring',
			hasCheckmark: true
		},
		{
			id: 10,
			title: "Death Note",
			subtitle: "デスノート",
			image: "/images/death-note.jpg",
			rating: 4.8,
			reviews: 356,
			episodes: 37,
			watching: 1678,
			type: 'Mystery, Thriller',
			season: 'Fall'
		},
		{
			id: 11,
			title: "Steins;Gate",
			subtitle: "シュタインズ・ゲート",
			image: "/images/steins-gate.jpg",
			rating: 4.9,
			reviews: 289,
			episodes: 24,
			watching: 1234,
			type: 'Sci-Fi, Thriller',
			season: 'Spring'
		},
		{
			id: 12,
			title: "Code Geass",
			subtitle: "コードギアス",
			image: "/images/code-geass.jpg",
			rating: 4.8,
			reviews: 267,
			episodes: 50,
			watching: 1456,
			type: 'Mecha, Drama',
			season: 'Fall'
		},
		{
			id: 13,
			title: "Fullmetal Alchemist",
			subtitle: "鋼の錬金術師",
			image: "/images/fma.jpg",
			rating: 5.0,
			reviews: 456,
			episodes: 64,
			watching: 2345,
			type: 'Action, Fantasy',
			season: 'Fall',
			hasCheckmark: true
		},
		{
			id: 14,
			title: "Sword Art Online",
			subtitle: "ソードアート・オンライン",
			image: "/images/sao.jpg",
			rating: 4.2,
			reviews: 234,
			episodes: 96,
			watching: 1567,
			type: 'Action, Fantasy',
			season: 'Summer'
		},
		{
			id: 15,
			title: "Naruto Shippuden",
			subtitle: "ナルト疾風伝",
			image: "/images/naruto.jpg",
			rating: 4.6,
			reviews: 567,
			episodes: 500,
			watching: 3456,
			type: 'Action, Shounen',
			season: 'Winter',
			hasCheckmark: true
		},
		{
			id: 16,
			title: "Hunter x Hunter",
			subtitle: "ハンター×ハンター",
			image: "/images/hxh.jpg",
			rating: 5.0,
			reviews: 423,
			episodes: 148,
			watching: 2234,
			type: 'Action, Adventure',
			season: 'Fall',
			hasCheckmark: true
		},
		{
			id: 17,
			title: "Mob Psycho 100",
			subtitle: "モブサイコ100",
			image: "/images/mob-psycho.jpg",
			rating: 4.8,
			reviews: 178,
			episodes: 25,
			watching: 892,
			type: 'Action, Comedy',
			season: 'Summer'
		},
		{
			id: 18,
			title: "Jujutsu Kaisen",
			subtitle: "呪術廻戦",
			image: "/images/jjk.jpg",
			rating: 4.9,
			reviews: 312,
			episodes: 24,
			watching: 1678,
			type: 'Action, Shounen',
			season: 'Fall',
			hasCheckmark: true
		},
		{
			id: 19,
			title: "Vinland Saga",
			subtitle: "ヴィンランド・サガ",
			image: "/images/vinland.jpg",
			rating: 4.7,
			reviews: 189,
			episodes: 24,
			watching: 987,
			type: 'Action, Historical',
			season: 'Summer'
		},
		{
			id: 20,
			title: "Spy x Family",
			subtitle: "スパイファミリー",
			image: "/images/spy-family.jpg",
			rating: 4.8,
			reviews: 267,
			episodes: 25,
			watching: 1456,
			type: 'Comedy, Action',
			season: 'Spring',
			hasCheckmark: true
		},
		// Thêm 5 items cho trang 2
		{
			id: 21,
			title: "Chainsaw Man",
			subtitle: "チェンソーマン",
			image: "/images/chainsaw-man.jpg",
			rating: 4.7,
			reviews: 234,
			episodes: 12,
			watching: 1123,
			type: 'Action, Horror',
			season: 'Fall',
			hasCheckmark: true
		},
		{
			id: 22,
			title: "Blue Lock",
			subtitle: "ブルーロック",
			image: "/images/blue-lock.jpg",
			rating: 4.5,
			reviews: 156,
			episodes: 24,
			watching: 892,
			type: 'Sports, Drama',
			season: 'Fall'
		},
		{
			id: 23,
			title: "Bocchi the Rock",
			subtitle: "ぼっち・ざ・ろっく",
			image: "/images/bocchi.jpg",
			rating: 4.8,
			reviews: 198,
			episodes: 12,
			watching: 756,
			type: 'Music, Comedy',
			season: 'Fall'
		},
		{
			id: 24,
			title: "Lycoris Recoil",
			subtitle: "リコリス・リコイル",
			image: "/images/lycoris.jpg",
			rating: 4.6,
			reviews: 167,
			episodes: 13,
			watching: 623,
			type: 'Action, Drama',
			season: 'Summer'
		},
		{
			id: 25,
			title: "The Eminence in Shadow",
			subtitle: "陰の実力者になりたくて",
			image: "/images/eminence.jpg",
			rating: 4.7,
			reviews: 189,
			episodes: 20,
			watching: 845,
			type: 'Action, Fantasy',
			season: 'Fall',
			isSpecial: true
		}
	]

	// Tính toán pagination
	const totalPages = Math.ceil(allContentList.length / itemsPerPage)

	// Lấy items cho trang hiện tại
	const currentItems = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage
		const endIndex = startIndex + itemsPerPage
		return allContentList.slice(startIndex, endIndex)
	}, [currentPage])


	const recentEpisodes: SidebarItem[] = [
		{
			id: 1,
			title: "Akuma no Riddle",
			subtitle: "Episode 2, Newcome Student",
			image: "/images/akuma.jpg",
			views: "1,012 views"
		},
		{
			id: 2,
			title: "Free! Eternal Summer",
			subtitle: "Episode 3, Summer Feelings",
			image: "/images/free.jpg",
			views: "1,832 views"
		},
		{
			id: 3,
			title: "Attack on Titan",
			subtitle: "Episode 8, Titan Fight!",
			image: "/images/aot.jpg",
			views: "1,123 views"
		},
		{
			id: 4,
			title: "Kill la Kill",
			subtitle: "Episode 10, Come and Get Us!",
			image: "/images/klk.jpg",
			views: "803 views"
		},
		{
			id: 5,
			title: "Samurai Flamenco",
			subtitle: "Episode 10, Other Day",
			image: "/images/samurai.jpg",
			views: "324 views"
		}
	]

	const recentVideos: VideoItem[] = [
		{
			id: 1,
			title: "Kill la Kill News Clip Streamed",
			thumbnail: "/images/klk-video.jpg",
			views: "1,231 views",
			comments: 23,
			date: "Posted on 12/08",
			duration: "08:04"
		},
		{
			id: 2,
			title: "Mekakucity Actors New Content Video",
			thumbnail: "/images/mekaku-video.jpg",
			views: "1,231 views",
			comments: 51,
			date: "Posted on 13/08",
			duration: "01:21"
		},
		{
			id: 3,
			title: "Akuma no Riddle News Streamed",
			thumbnail: "/images/akuma-video.jpg",
			views: "1,231 views",
			comments: 11,
			date: "Posted on 13/08",
			duration: "00:46"
		}
	]

	const renderStars = (rating: number) => {
		return [...Array(5)].map((_, i) => (
			<Star
				key={i}
				className={`rating-star ${i < Math.floor(rating) ? 'filled' : 'empty'}`}
			/>
		))
	}

	const handlePageChange = (page: number) => {
		setCurrentPage(page)

		// Scroll lên đầu content-grid-wrapper
		const wrapper = document.querySelector('.content-grid-wrapper')
		if (wrapper) {
			const headerHeight = 80 // Chiều cao header
			const wrapperTop = wrapper.getBoundingClientRect().top + window.pageYOffset - headerHeight

			window.scrollTo({
				top: wrapperTop,
				behavior: 'smooth'
			})
		}
	}

	const renderPagination = () => {
		const pages = []

		// First page button
		pages.push(
			<button
				key="first"
				onClick={() => handlePageChange(1)}
				disabled={currentPage === 1}
				className="pagination-button"
			>
				First
			</button>
		)

		// Previous button
		pages.push(
			<button
				key="prev"
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="pagination-button"
			>
				&lt;
			</button>
		)

		// Page numbers
		if (currentPage > 2) {
			pages.push(<span key="dots1" className="pagination-dots">...</span>)
		}

		for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
			pages.push(
				<button
					key={i}
					onClick={() => handlePageChange(i)}
					className={`pagination-button ${currentPage === i ? 'active' : ''}`}
				>
					{i}
				</button>
			)
		}

		if (currentPage < totalPages - 1) {
			pages.push(<span key="dots2" className="pagination-dots">...</span>)
		}

		// Next button
		pages.push(
			<button
				key="next"
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="pagination-button"
			>
				&gt;
			</button>
		)

		// Last page button
		pages.push(
			<button
				key="last"
				onClick={() => handlePageChange(totalPages)}
				disabled={currentPage === totalPages}
				className="pagination-button"
			>
				Last
			</button>
		)

		return pages
	}

	return (
		<div className="content-grid-wrapper">
			<div className="content-grid-background">
				<img src={contentGridBg} alt="content grid background" />
			</div>
			<div className="content-grid-container">
				{/* LEFT SECTION - Main Content */}
				<div className="content-main">
					{/* Tabs with Dividers */}
					<div className="content-header">
						<div className="content-tabs">
							<Link to="/content/trending" className="content-tab">
								Trending Movies
							</Link>
							<span className="tab-divider">|</span>
							<Link to="/content/airing" className="content-tab active">
								Airing Now
							</Link>
							<span className="tab-divider">|</span>
							<Link to="/content/books" className="content-tab">
								Books
							</Link>
						</div>
					</div>

					{/* Content Cards Grid */}
					<div className="content-cards">
						{currentItems.map((content) => (
							<Link key={content.id} to={`/content/${content.id}`} className="content-card">
								{/* Image Container */}
								<div className="card-image-container">
									<div className="card-overlay" />

									{content.hasCheckmark && (
										<div className="card-checkmark">
											<Check className="h-4 w-4 text-white" strokeWidth={3} />
										</div>
									)}

									{content.isSpecial && (
										<div className="card-badge">
											{content.episodes}/16 episodes aired
										</div>
									)}

									{/* Title Overlay */}
									<div className="card-title-overlay">
										<h3 className="card-title">{content.title}</h3>
										{content.subtitle && (
											<p className="card-subtitle">{content.subtitle}</p>
										)}
									</div>
								</div>

								{/* Info Section */}
								<div className="card-info">
									<div className="card-meta">
										<span className="card-type">{content.type}</span>
										<span className="card-season">{content.season}</span>
									</div>

									{/* Rating */}
									<div className="card-rating">
										<div className="rating-stars">{renderStars(content.rating)}</div>
										<span className="rating-text">({content.reviews} reviews)</span>
									</div>

									{/* Stats */}
									<div className="card-stats">
										<div className="stat-item">
											<div className="stat-value">{content.watching}</div>
											<div className="stat-label">Watching</div>
										</div>
										<div className="stat-item">
											<div className="stat-value">{content.episodes}</div>
											<div className="stat-label">Episodes</div>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>

					{/* Pagination */}
					<div className="content-pagination">
						{renderPagination()}
					</div>
				</div>

				{/* RIGHT SECTION - Sidebar */}
				<aside className="content-sidebar">
					{/* Recent Episodes */}
					<div className="sidebar-section">
						<div className="sidebar-header">
							<h3 className="sidebar-title">Recent Episodes</h3>
							<Link to="/episodes" className="sidebar-link">View all</Link>
						</div>

						<div className="sidebar-tabs">
							<Link to="/recent" className="sidebar-tab active">Recent Episodes</Link>
							<Link to="/recommended" className="sidebar-tab">Recommended</Link>
						</div>

						<div className="sidebar-list">
							{recentEpisodes.map((item) => (
								<Link key={item.id} to={`/episode/${item.id}`} className="sidebar-item">
									<img src={item.image} alt={item.title} className="sidebar-item-image" />
									<div className="sidebar-item-info">
										<h4 className="sidebar-item-title">{item.title}</h4>
										<p className="sidebar-item-subtitle">{item.subtitle}</p>
										<span className="sidebar-item-views">{item.views}</span>
									</div>
								</Link>
							))}
						</div>
					</div>

					{/* Anime of the Week */}
					<div className="sidebar-section">
						<div className="sidebar-header">
							<h3 className="sidebar-title">Anime of the Week</h3>
							<Link to="/previous" className="sidebar-link">View previous</Link>
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

					{/* Most Recent Videos */}
					<div className="sidebar-section">
						<div className="sidebar-header">
							<h3 className="sidebar-title">Most Recent Videos</h3>
							<Link to="/videos" className="sidebar-link">View more</Link>
						</div>

						<div className="sidebar-list">
							{recentVideos.map((video) => (
								<Link key={video.id} to={`/video/${video.id}`} className="video-item">
									<div className="video-thumbnail-wrapper">
										<img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
										<div className="video-play-icon">
											<Play className="h-5 w-5 text-white" fill="white" />
										</div>
										<span className="video-duration">{video.duration}</span>
									</div>
									<div className="video-info">
										<p className="video-date">{video.date}</p>
										<h4 className="video-title">{video.title}</h4>
										<span className="video-views">{video.views}</span>
										<div className="video-comments">
											<MessageSquare className="h-3 w-3" />
											<span>{video.comments} comments</span>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</aside>
			</div>
		</div>
	)
}

export default ContentGrid
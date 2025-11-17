import { Link } from 'react-router-dom'
import { Star, Check, Crown } from 'lucide-react'
import type { ContentCard as ContentCardType } from '@/types/content.types'

interface ContentCardProps {
	content: ContentCardType
}

export const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
	const renderStars = (rating: number) => {
		return [...Array(5)].map((_, i) => (
			<Star
				key={i}
				className={`rating-star ${i < Math.floor(rating) ? 'filled' : 'empty'}`}
			/>
		))
	}

	return (
		<Link to={`/movies/${content.id}`} className="content-card">
			{/* Image Container */}
			<div className="card-image-container">
				<img
					src={content.image}
					alt={content.title}
					className="card-image"
					loading="lazy"
				/>
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

				{/* Premium Badge */}
				{content.isPremium && (
					<div className="card-premium-badge">
						<Crown className="premium-icon" size={16} />
						<span>Premium</span>
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
						<div className="stat-value">
							{content.watching.toLocaleString()}
							<span className="stat-label-topright">views</span>
						</div>
					</div>
					<div className="stat-item">
						<div className="stat-value">
							{content.episodes}
							<span className="stat-label-topright">mins</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	)
}

export default ContentCard

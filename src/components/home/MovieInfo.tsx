import { Star, Crown, FolderPlus } from 'lucide-react'
import '@/styles/MovieInfo.css'

interface MovieInfoProps {
	movie: {
		quality: string
		releaseYear: number
		genres: string[]
		director: string
		cast: string[]
		country: string
		duration: string
		rating: number
		totalVotes: number
		description: string
		isPremium?: boolean
	}
	onAddToCollection?: () => void
}

export const MovieInfo = ({ movie, onAddToCollection }: MovieInfoProps) => {
	const renderStars = (rating: number) => {
		const totalStars = 10
		return [...Array(totalStars)].map((_, i) => (
			<Star
				key={i}
				className={`star-icon ${i < rating ? 'filled' : 'empty'}`}
				fill={i < rating ? '#fbbf24' : 'none'}
			/>
		))
	}

	return (
		<section className="movie-info-section">
			<div className="movie-info-container">
				{/* Left Column - Main Info */}
				<div className="movie-info-main">
					{/* Rating */}
					<div className="rating-section">
						<div className="stars-container">
							{renderStars(movie.rating)}
						</div>
						<span className="rating-text">({movie.rating} times)</span>
					</div>

					{/* Action Buttons */}
					{onAddToCollection && (
						<div className="action-buttons">
							<button className="btn-add-to-collection" onClick={onAddToCollection}>
								<FolderPlus size={20} />
								<span>Add to Collection</span>
							</button>
						</div>
					)}

					{/* Movie Details */}
					<div className="movie-details">
						{movie.isPremium && (
							<div className="detail-row premium-row">
								<span className="detail-value premium-badge">
									<Crown size={16} />
									PREMIUM CONTENT
								</span>
							</div>
						)}
						<div className="detail-row">
							<span className="detail-label">Now playing:</span>
							<span className="detail-value quality">{movie.quality}</span>
						</div>
						<div className="detail-row">
							<span className="detail-label">Category:</span>
							<div className="detail-value">
								{movie.genres.map((genre, index) => (
									<a key={index} href={`/genre/${genre}`} className="genre-link">
										{genre}
									</a>
								))}
							</div>
						</div>
						<div className="detail-row">
							<span className="detail-label">Release Year:</span>
							<span className="detail-value year">{movie.releaseYear}</span>
						</div>
						<div className="detail-row">
							<span className="detail-label">Director:</span>
							<span className="detail-value director">{movie.director}</span>
						</div>
						<div className="detail-row">
							<span className="detail-label">Country:</span>
							<span className="detail-value country">{movie.country}</span>
						</div>
						<div className="detail-row">
							<span className="detail-label">Performer:</span>
							<div className="detail-value">
								{movie.cast.map((actor, index) => (
									<a key={index} href={`/actor/${actor}`} className="actor-link">
										{actor}
									</a>
								))}
							</div>
						</div>
						<div className="detail-row">
							<span className="detail-label">Duration:</span>
							<span className="detail-value">{movie.duration}</span>
						</div>
					</div>

					{/* Description */}
					<div className="movie-description">
						<h2 className="description-title">Movie Information</h2>
						<p className="description-text">{movie.description}</p>
					</div>

				</div>
			</div>
		</section>
	)
}

export default MovieInfo
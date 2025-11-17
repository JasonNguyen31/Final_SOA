import { useState } from 'react'
import { Play, Youtube } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useAuthModal } from '@/context/AuthModalContext'
import { PremiumUpgradeModal } from '@/components/common/Modal/PremiumUpgradeModal'
import '@/styles/MovieDetailHero.css'

interface MovieDetailHeroProps {
	movie: {
		id: any
		title: string
		originalTitle: string
		posterUrl: string
		coverUrl: string
		trailerUrl: string
		isPremium?: boolean
	}
}

export const MovieDetailHero = ({ movie }: MovieDetailHeroProps) => {
	const navigate = useNavigate()
	const { isAuthenticated, user } = useAuth()
	const { openLogin } = useAuthModal()
	const [showPremiumModal, setShowPremiumModal] = useState(false)

	// Use static background image
	const coverImage = movie.coverUrl || movie.posterUrl

	const handleWatchClick = () => {
		if (!isAuthenticated) {
			// If not logged in, show login modal
			openLogin()
		} else if (movie.isPremium && !user?.isPremium) {
			// If movie is premium but user is not premium, show upgrade popup
			setShowPremiumModal(true)
		} else {
			// If logged in and has access, navigate to watch page
			navigate(`/movies/${movie.id}/watch`)
		}
	}

	return (
		<section className="movie-detail-hero">
			<div
				className="hero-background active"
				style={{ backgroundImage: `url(${coverImage})` }}
			/>

			{/* Overlay Gradient */}
			<div className="hero-overlay"></div>

			{/* Content */}
			<div className="hero-content-wrapper">
				<div className="hero-content">
					{/* Poster */}
					<div className="hero-poster">
						<img
							src={movie.posterUrl}
							alt={movie.title}
						/>
						<div className="poster-play-button">
							<Play className="play-icon" fill="white" />
						</div>
					</div>

					{/* Info */}
					<div className="hero-info">
						<h1 className="hero-title">{movie.title}</h1>
						<p className="hero-original-title">{movie.originalTitle}</p>

						{/* Action Buttons */}
						<div className="hero-actions">
							<button className="btn-trailer">
								<Youtube className="btn-icon" />
								Trailer
							</button>
							<button onClick={handleWatchClick} className="btn-watch">
								<Play className="btn-icon" fill="white" />
								Watch Movie
							</button>
						</div>
					</div>
				</div>
			</div>

			<PremiumUpgradeModal
				isOpen={showPremiumModal}
				onClose={() => setShowPremiumModal(false)}
			/>
		</section>
	)
}

export default MovieDetailHero
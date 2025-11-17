import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { VideoPlayer } from '@/components/content/VideoPlayer/VideoPlayer'
import { MovieMetaBreadcrumb } from '@/components/home/MovieMetaBreadcrumb'
import { EpisodeList } from '@/components/home/EpisodeList'
import { CommentSection } from '@/components/home/CommentSection'
import { RecommendedMovies } from '@/components/home/RecommendedMovies'
import { PremiumUpgradeModal } from '@/components/common/Modal/PremiumUpgradeModal'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAuth } from '@/context/AuthContext'
import { movieService } from '@/services/content/movieService'
import type { MovieDetail } from '@/services/content/movieService'
import '@/styles/WatchMoviePage.css'

export const MovieWatch = () => {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const { user } = useAuth()
	const [currentEpisode, setCurrentEpisode] = useState(1)
	const [movie, setMovie] = useState<MovieDetail | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [showPremiumModal, setShowPremiumModal] = useState(false)

	useEffect(() => {
		const fetchMovie = async () => {
			if (!id) {
				setError('Movie ID is required')
				setLoading(false)
				return
			}

			try {
				setLoading(true)
				const data = await movieService.getMovieById(id)

				// Check if movie is premium and user is not premium
				if (data.isPremium && !user?.isPremium) {
					setShowPremiumModal(true)
					setLoading(false)
					// Redirect back to movie detail page after showing modal
					setTimeout(() => {
						navigate(`/movies/${id}`)
					}, 500)
					return
				}

				setMovie(data)
			} catch (err) {
				console.error('Error fetching movie:', err)
				setError('Failed to load movie. Please try again later.')
			} finally {
				setLoading(false)
			}
		}

		fetchMovie()
	}, [id, user])

	usePageTitle(movie ? `Watch ${movie.title} - Entertainment Platform` : 'Watch Movie')

	if (loading) {
		return (
			<Layout>
				<div className="watch-movie-page">
					<div className="loading-spinner">Loading movie...</div>
				</div>
			</Layout>
		)
	}

	if (error || !movie) {
		return (
			<Layout>
				<div className="watch-movie-page">
					<div className="error-message">
						<h2>{error || 'Movie not found'}</h2>
						<button onClick={() => window.history.back()}>Go Back</button>
					</div>
				</div>
			</Layout>
		)
	}

	// Prepare movie data
	const movieData = {
		id: movie.id,
		title: movie.title,
		originalTitle: movie.title,
		breadcrumbs: [
			{ label: "Home", url: "/home" },
			{ label: movie.genres?.[0] || "Movies", url: `/movies?genre=${movie.genres?.[0]}` },
			{ label: movie.title, url: `/movies/${id}` },
			{ label: "Watch", url: "#" }
		],
		videoUrl: movie.videoUrl,
		description: movie.description,
		rating: Math.round(movie.rating || 0),
		totalVotes: movie.totalRatings || 0,
		episodes: [
			{ number: 1, title: "Full Movie", duration: `${Math.floor((movie.duration || 0) / 60)} min` }
		],
		genres: movie.genres || []
	}

	return (
		<Layout>
			<div className="watch-movie-page">
				{/* Breadcrumb */}
				<MovieMetaBreadcrumb breadcrumbs={movieData.breadcrumbs} />

				{/* Video Player */}
				<VideoPlayer
					videoUrl={movieData.videoUrl}
					title={movieData.title}
					currentEpisode={currentEpisode}
					movieId={id}
				/>

				{/* Movie Info & Episodes */}
				<div className="watch-content-wrapper">
					<div className="watch-container">
						{/* Movie Info Section */}
						<div className="watch-info-section">
							<h1 className="movie-title-watch">{movieData.title} - Full Episode</h1>
							<h2 className="movie-subtitle-watch">{movieData.originalTitle}</h2>

							<div className="movie-description-watch">
								<p>{movieData.description}</p>
								<a href={`/movies/${id}`} className="read-more-link">[view more]</a>
							</div>

							{/* Rating */}
							<div className="movie-rating-watch">
								<div className="rating-stars-watch">
									{[...Array(10)].map((_, i) => (
										<span key={i} className={`star ${i < movieData.rating ? 'filled' : 'empty'}`}>★</span>
									))}
								</div>
								<span className="rating-text-watch">{movieData.rating} Points</span>
								<span className="votes-text-watch">({movieData.totalVotes} rates)</span>
							</div>

							{/* Episode List */}
							<EpisodeList
								episodes={movieData.episodes}
								currentEpisode={currentEpisode}
								onEpisodeChange={setCurrentEpisode}
							/>
						</div>

						{/* Comment Section */}
						<CommentSection
							contentType="movie"
							contentId={String(movie.id)}
							currentUserId={user?.id}
							currentUserName={user?.displayName || user?.username || 'User'}
							currentUserAvatar={user?.avatar}
						/>

						{/* Recommended Movies */}
						<RecommendedMovies
							currentMovieId={movie.id}
							currentMovieTitle={movie.title}
							currentMovieGenres={movie.genres || []}
						/>
					</div>
				</div>
			</div>

			<PremiumUpgradeModal
				isOpen={showPremiumModal}
				onClose={() => {
					setShowPremiumModal(false)
					navigate(`/movies/${id}`)
				}}
			/>
		</Layout>
	)
}

export default MovieWatch;

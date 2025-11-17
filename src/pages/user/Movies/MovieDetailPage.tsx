import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useAuthModal } from '@/context/AuthModalContext'
import { GuestHeader } from '@/components/home/GuestHeader'
import Header from '@/components/layout/Header/Header'
import Footer from '@/components/layout/Footer/Footer'
import { MovieDetailHero } from '@/components/home/MovieDetailHero'
import { MovieInfo } from '@/components/home/MovieInfo'
import { CommentSection } from '@/components/home/CommentSection'
import { RecommendedMovies } from '@/components/home/RecommendedMovies'
import { AddToCollectionModal } from '@/components/common/Modal/AddToCollectionModal'
import { usePageTitle } from '@/hooks/usePageTitle'
import { movieService, type MovieDetail } from '@/services/content/movieService'
import '@/styles/MovieDetailPage.css'

export const MovieDetailPage = () => {
	const { id } = useParams<{ id: string }>()
	const { isAuthenticated, user } = useAuth()
	const { openLogin, openRegister } = useAuthModal()
	const [movie, setMovie] = useState<MovieDetail | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [showAddToCollection, setShowAddToCollection] = useState(false)

	usePageTitle(movie ? `${movie.title} - Entertainment Platform` : 'Movie Details')

	useEffect(() => {
		// Scroll to top when navigating to movie detail
		window.scrollTo({ top: 0, behavior: 'smooth' })

		const fetchMovie = async () => {
			if (!id) {
				setError('Movie ID is required')
				setLoading(false)
				return
			}

			try {
				setLoading(true)
				setError(null)
				const data = await movieService.getMovieById(id)
				setMovie(data)
			} catch (err: any) {
				console.error('Error fetching movie:', err)
				setError('Failed to load movie details. Please try again later.')
			} finally {
				setLoading(false)
			}
		}

		fetchMovie()
	}, [id])

	if (loading) {
		return (
			<div className="app-layout">
				{isAuthenticated ? <Header /> : <GuestHeader onLogin={openLogin} onRegister={openRegister} />}
				<main className="app-main">
					<div className="movie-detail-page loading">
						<div className="loading-spinner">Loading movie details...</div>
					</div>
				</main>
				<Footer />
			</div>
		)
	}

	if (error || !movie) {
		return (
			<div className="app-layout">
				{isAuthenticated ? <Header /> : <GuestHeader onLogin={openLogin} onRegister={openRegister} />}
				<main className="app-main">
					<div className="movie-detail-page error">
						<div className="error-message">
							<h2>{error || 'Movie not found'}</h2>
							<button onClick={() => window.history.back()}>Go Back</button>
						</div>
					</div>
				</main>
				<Footer />
			</div>
		)
	}

	// Transform movie data to match component expectations
	const movieHeroData = {
		id: movie.id,
		title: movie.title,
		originalTitle: movie.title,
		posterUrl: movie.thumbnailUrl,
		coverUrl: movie.bannerUrl || movie.thumbnailUrl,
		trailerUrl: movie.videoUrl,
		isPremium: movie.isPremium
	}

	const movieInfoData = {
		quality: movie.isPremium ? 'HD + 4K (Premium)' : 'HD + 4K',
		releaseYear: movie.releaseYear || 2024,
		genres: movie.genres || [],
		director: movie.director,
		cast: movie.cast || [],
		country: movie.country || 'Unknown',
		duration: movie.duration ? `${Math.floor(movie.duration / 60)} minutes` : 'N/A',
		rating: movie.rating || 0,
		totalVotes: movie.totalRatings || 0,
		description: movie.description,
		isPremium: movie.isPremium
	}

	return (
		<div className="app-layout">
			{isAuthenticated ? <Header /> : <GuestHeader onLogin={openLogin} onRegister={openRegister} />}
			<main className="app-main">
				<div className="movie-detail-page">
					<MovieDetailHero movie={movieHeroData} />
					<MovieInfo
						movie={movieInfoData}
						onAddToCollection={isAuthenticated ? () => setShowAddToCollection(true) : openLogin}
					/>
					<CommentSection
						contentType="movie"
						contentId={String(movie.id)}
						currentUserId={user?.id}
						currentUserName={user?.displayName || user?.username || 'User'}
						currentUserAvatar={user?.avatar}
					/>
					<RecommendedMovies
						currentMovieId={movie.id}
						currentMovieTitle={movie.title}
						currentMovieGenres={movie.genres || []}
					/>
				</div>
			</main>
			<Footer />

			{/* Add to Collection Modal */}
			{isAuthenticated && movie && (
				<AddToCollectionModal
					isOpen={showAddToCollection}
					onClose={() => setShowAddToCollection(false)}
					contentId={String(movie.id)}
					contentType="movie"
					contentTitle={movie.title}
					contentThumbnail={movie.thumbnailUrl}
				/>
			)}
		</div>
	)
}

export default MovieDetailPage
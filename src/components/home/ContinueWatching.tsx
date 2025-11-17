import { useState, useEffect } from 'react'
import { Play, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { movieService, type Movie } from '@/services/content/movieService'
import '../styles/ContinueWatching.css'

interface MovieWithProgress extends Movie {
	progress?: number
	lastWatchedAt?: string
}

export const ContinueWatching = () => {
	const navigate = useNavigate()
	const [movies, setMovies] = useState<MovieWithProgress[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		loadContinueWatching()
	}, [])

	const loadContinueWatching = async () => {
		setIsLoading(true)
		try {
			// Call API to get continue watching movies
			const data = await movieService.getContinueWatching()
			// Filter movies with progress between 1% and 90%
			const filteredMovies = data.filter(
				(movie: MovieWithProgress) =>
					movie.progress && movie.progress > 0 && movie.progress < 90
			)
			setMovies(filteredMovies)
		} catch (error) {
			console.error('Failed to load continue watching:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleMovieClick = (movieId: string) => {
		navigate(`/watch/${movieId}`)
	}

	const formatProgress = (progress: number) => {
		return `${Math.round(progress)}%`
	}

	if (isLoading) {
		return (
			<section className="continue-watching-section">
				<div className="section-header">
					<Clock size={24} />
					<h2 className="section-title">Continue Watching</h2>
				</div>
				<div className="continue-watching-loading">
					<div className="loading-spinner"></div>
				</div>
			</section>
		)
	}

	if (movies.length === 0) {
		return null // Don't show section if no movies to continue
	}

	return (
		<section className="continue-watching-section">
			<div className="section-header">
				<Clock size={24} className="section-icon" />
				<h2 className="section-title">Continue Watching</h2>
			</div>

			<div className="continue-watching-grid">
				{movies.map((movie) => (
					<div
						key={movie._id}
						className="continue-watching-card"
						onClick={() => handleMovieClick(movie._id)}
					>
						<div className="card-image-wrapper">
							<img
								src={movie.thumbnail || '/placeholder-movie.jpg'}
								alt={movie.title}
								className="card-image"
							/>
							<div className="card-overlay">
								<button className="play-button">
									<Play size={32} fill="white" />
								</button>
							</div>

							{/* Progress Bar */}
							<div className="progress-bar-container">
								<div
									className="progress-bar"
									style={{ width: formatProgress(movie.progress || 0) }}
								></div>
							</div>
						</div>

						<div className="card-info">
							<h3 className="card-title">{movie.title}</h3>
							<div className="card-meta">
								<span className="card-progress">{formatProgress(movie.progress || 0)}</span>
								{movie.duration && (
									<>
										<span className="meta-separator">•</span>
										<span className="card-duration">{movie.duration} min</span>
									</>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

export default ContinueWatching

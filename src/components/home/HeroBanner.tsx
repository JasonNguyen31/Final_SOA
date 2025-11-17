import { Heart, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '@/styles/HeroBanner.css'
import { movieService } from '@/services/content/movieService'
import type { Movie } from '@/services/content/movieService'

interface FeaturedMovie extends Movie {
	backgroundImage?: string
	tags?: string
	subtitle?: string
	longDescription?: string
}

export const HeroBanner = () => {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [isAnimating] = useState(false)
	const [featuredMovies, setFeaturedMovies] = useState<FeaturedMovie[]>([])
	const [loading, setLoading] = useState(true)

	// Fetch featured movies from API
	useEffect(() => {
		const fetchFeatured = async () => {
			try {
				setLoading(true)
				// Fetch latest/hottest movies sorted by release year (newest first)
				const response = await movieService.getMovies({
					sortBy: 'releaseYear',
					order: 'desc',
					limit: 5,
					page: 1
				})
				const transformedMovies = response.movies.map((movie) => ({
					...movie,
					backgroundImage: movie.bannerUrl || movie.thumbnailUrl,
					tags: movie.genres?.join(', ').toUpperCase() || 'MOVIE',
					subtitle: movie.releaseYear?.toString() || '',
					longDescription: movie.description || 'Watch now on our platform!'
				}))
				setFeaturedMovies(transformedMovies)
			} catch (error) {
				console.error('Error fetching featured movies:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchFeatured()
	}, [])

	// Preload images
	useEffect(() => {
		if (featuredMovies.length > 0) {
			featuredMovies.forEach((movie) => {
				const img = new Image()
				img.src = movie.backgroundImage || ''
			})
		}
	}, [featuredMovies])

	// Auto slide every 10 seconds
	useEffect(() => {
		if (featuredMovies.length === 0) return
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)
		}, 10000)

		return () => clearInterval(interval)
	}, [featuredMovies.length])

	const nextSlide = () => {
		if (featuredMovies.length === 0) return
		setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)
	}

	const prevSlide = () => {
		if (featuredMovies.length === 0) return
		setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)
	}

	// const handleSlideChange = (newIndex: number) => {
	// 	setIsAnimating(true)
	// 	setCurrentSlide(newIndex)
	// 	setTimeout(() => setIsAnimating(false), 800)
	// }

	if (loading) {
		return (
			<section className="hero-banner">
				<div className="hero-overlay"></div>
				<div className="hero-container">
					<div className="hero-content">
						<div className="hero-left">Loading featured content...</div>
					</div>
				</div>
			</section>
		)
	}

	if (featuredMovies.length === 0) {
		return null
	}

	const current = featuredMovies[currentSlide]

	return (
		<section className="hero-banner">
			{/* Background Images - All layers */}
			{featuredMovies.map((movie, index) => (
				<div
					key={movie.id}
					className={`hero-background ${index === currentSlide ? 'active' : ''}`}
					style={{ backgroundImage: `url(${movie.backgroundImage})` }}
				/>
			))}

			{/* Overlay Gradient */}
			<div className="hero-overlay"></div>

			{/* Background Pattern */}
			<div className="hero-pattern"></div>

			<div className="hero-container">
				<div className="hero-content">
					{/* Left Content */}
					<div className={`hero-left ${isAnimating ? 'slide-enter' : ''}`}>
						<div className="hero-tag">
							{current.tags}
						</div>

						<div className="hero-titles">
							<h1 className="hero-title">
								{current.title}
							</h1>
							<div className="hero-subtitle">
								{current.subtitle}
							</div>
							<div className="hero-description">
								NOW STREAMING
							</div>
						</div>

						<p className="hero-text">
							{current.longDescription}
						</p>

						<div className="hero-actions">
							<Link to={`/movies/${current.id}`} className="btn-primary">
								<span>Watch Now</span>
							</Link>

							<button className="btn-icon-group">
								<div className="btn-icon">
									<Heart className="icon" />
								</div>
								<span className="btn-label">Like</span>
							</button>

							<button className="btn-icon-group">
								<div className="btn-icon">
									<Plus className="icon" />
								</div>
								<span className="btn-label">Add to collection</span>
							</button>
						</div>

						{/* Navigation Buttons */}
						<div className="hero-navigation">
							<button
								onClick={prevSlide}
								className="nav-button nav-button-prev"
							>
								<ChevronLeft className="nav-button-icon" />
								<span className="nav-button-text">Previous</span>
							</button>

							{/* Slide Indicators */}
							<div className="slide-indicators">
								{featuredMovies.map((_, index) => (
									<button
										key={index}
										className={`indicator ${index === currentSlide ? 'active' : ''}`}
										onClick={() => setCurrentSlide(index)}
										aria-label={`Go to slide ${index + 1}`}
									/>
								))}
							</div>

							<button
								onClick={nextSlide}
								className="nav-button nav-button-next"
							>
								<span className="nav-button-text">Next</span>
								<ChevronRight className="nav-button-icon" />
							</button>
						</div>
					</div>

					{/* Right Character Image */}
					<div className="hero-right">
						<div className="character-container">
							{/* Action lines effect */}
							<div className="action-lines">
								{[...Array(12)].map((_, i) => (
									<div
										key={i}
										className="action-line"
										style={{
											top: `${Math.random() * 100}%`,
											left: `${Math.random() * 50}%`,
											transform: `rotate(${-15 + Math.random() * 30}deg)`,
											animationDelay: `${Math.random() * 2}s`,
											animationDuration: `${2 + Math.random() * 2}s`
										}}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default HeroBanner
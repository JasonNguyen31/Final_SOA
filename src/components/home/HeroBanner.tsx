import { Heart, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import '@/styles/HeroBanner.css'
import demonslayerBg from '@/assets/images/demonslayer.jpg'
import jutsukaizenBg from '@/assets/images/jutsukaizen.jpg'
import bokunoheroBg from '@/assets/images/aot.jpg'

export const HeroBanner = () => {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [isAnimating] = useState(false)
	// const [isAnimating, setIsAnimating] = useState(false)
	const featuredAnime = [
		{
			id: 1,
			title: 'DEMON SLAYER',
			subtitle: 'SEASON 4',
			description: 'NOW STREAMING',
			longDescription: 'Tanjiro and his friends embark on a new mission in the Swordsmith Village. Face the Upper Rank demons in the most intense battle yet!',
			backgroundImage: demonslayerBg,
			tags: 'ACTION, ADVENTURE, SUPERNATURAL'
		},
		{
			id: 2,
			title: 'JUJUTSU KAISEN',
			subtitle: 'SHIBUYA ARC',
			description: 'NEW EPISODES',
			longDescription: 'The Shibuya Incident reaches its climax as Yuji and the sorcerers face their greatest challenge. The fate of humanity hangs in the balance!',
			backgroundImage: jutsukaizenBg,
			tags: 'ACTION, DARK FANTASY, SUPERNATURAL'
		},
		{
			id: 3,
			title: 'BOKU NO HERO',
			subtitle: 'SEASON 3',
			description: 'NEW EPISODES',
			longDescription: 'Deku and his friends in the academy fight against superpowered criminals to protect the world!',
			backgroundImage: bokunoheroBg,
			tags: 'ACTION, ACADEMY, HERO, SUPERNATURAL'
		}
	]

	// Preload tất cả ảnh khi component mount
	useEffect(() => {
		featuredAnime.forEach((anime) => {
			const img = new Image()
			img.src = anime.backgroundImage
		})
	}, [])

	// Auto slide mỗi 5 giây
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % featuredAnime.length)
		}, 10000)

		return () => clearInterval(interval)
	}, [featuredAnime.length])

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % featuredAnime.length)
	}

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + featuredAnime.length) % featuredAnime.length)
	}

	// const handleSlideChange = (newIndex: number) => {
	// 	setIsAnimating(true)
	// 	setCurrentSlide(newIndex)
	// 	setTimeout(() => setIsAnimating(false), 800)
	// }

	const current = featuredAnime[currentSlide]

	return (
		<section className="hero-banner">
			{/* Background Images - All layers */}
			{featuredAnime.map((anime, index) => (
				<div
					key={anime.id}
					className={`hero-background ${index === currentSlide ? 'active' : ''}`}
					style={{ backgroundImage: `url(${anime.backgroundImage})` }}
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
								{current.description}
							</div>
						</div>

						<p className="hero-text">
							{current.longDescription}
						</p>

						<div className="hero-actions">
							<button className="btn-primary">
								<span>Watch Now</span>
							</button>

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
								{featuredAnime.map((_, index) => (
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
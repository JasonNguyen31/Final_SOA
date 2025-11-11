import { Heart, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export const HeroBanner = () => {
	const [currentSlide, setCurrentSlide] = useState(0)

	const featuredAnime = [
		{
			id: 1,
			title: 'KILL LA KILL',
			subtitle: 'NEW EPISODES',
			description: 'ANNOUNCED TODAY',
			longDescription: 'The team that brought you Gurren Lagann and Panty & Stocking reunited to present what is looking to be one of the most over the top action series in a long time!',
			backgroundImage: '/images/kill-la-kill-bg.jpg',
			character: '/images/ryuko-matoi.png'
		}
	]

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % featuredAnime.length)
	}

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + featuredAnime.length) % featuredAnime.length)
	}

	const current = featuredAnime[currentSlide]

	return (
		<section className="relative w-full bg-gradient-to-r from-red-900 via-orange-800 to-yellow-700 overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute inset-0" style={{
					backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
				}} />
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="relative flex items-center min-h-[500px]">
					{/* Left Content */}
					<div className="relative z-10 w-full lg:w-1/2 space-y-6">
						<div className="bg-gray-900 text-white px-3 py-1 inline-block rounded text-xs font-semibold">
							ACTION, ADVENTURE
						</div>

						<div className="space-y-2">
							<h1 className="text-5xl lg:text-7xl font-black text-gray-900">
								{current.title}
							</h1>
							<div className="text-3xl lg:text-4xl font-bold text-gray-800">
								{current.subtitle}
							</div>
							<div className="text-2xl lg:text-3xl font-bold text-orange-600">
								{current.description}
							</div>
						</div>

						<p className="text-gray-700 max-w-xl text-sm lg:text-base leading-relaxed">
							{current.longDescription}
						</p>

						<div className="flex items-center space-x-4">
							<button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-semibold transition-colors flex items-center space-x-2">
								<span>Read more</span>
							</button>

							<div className="flex items-center space-x-2">
								<button className="p-2 bg-white/20 backdrop-blur rounded-md hover:bg-white/30 transition-colors">
									<Heart className="h-5 w-5 text-gray-800" />
								</button>
								<span className="text-gray-700 font-medium">Like</span>
							</div>

							<div className="flex items-center space-x-2">
								<button className="p-2 bg-white/20 backdrop-blur rounded-md hover:bg-white/30 transition-colors">
									<Plus className="h-5 w-5 text-gray-800" />
								</button>
								<span className="text-gray-700 font-medium">Save</span>
							</div>
						</div>

						{/* Navigation Buttons */}
						<div className="flex items-center space-x-4 pt-4">
							<button
								onClick={prevSlide}
								className="bg-gray-900 hover:bg-gray-800 text-white p-3 rounded-md transition-colors flex items-center space-x-2"
							>
								<ChevronLeft className="h-5 w-5" />
								<span className="text-sm">To Aru Kagaku no Railgun S Trailer</span>
							</button>

							<button
								onClick={nextSlide}
								className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-md transition-colors flex items-center space-x-2"
							>
								<span className="text-sm">Uchuu Senkan Yamato Teaser Released!</span>
								<ChevronRight className="h-5 w-5" />
							</button>
						</div>
					</div>

					{/* Right Character Image - Using gradient as placeholder */}
					<div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2">
						<div className="relative h-full">
							<div className="absolute right-0 bottom-0 w-[600px] h-[600px]">
								<div className="relative w-full h-full">
									{/* Placeholder for anime character */}
									<div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent" />
								</div>
							</div>

							{/* Action lines effect */}
							<div className="absolute inset-0 overflow-hidden">
								{[...Array(10)].map((_, i) => (
									<div
										key={i}
										className="absolute bg-gradient-to-r from-transparent via-white/5 to-transparent h-0.5"
										style={{
											top: `${Math.random() * 100}%`,
											left: `${Math.random() * 50}%`,
											right: 0,
											transform: `rotate(${-15 + Math.random() * 30}deg)`,
											animation: `pulse ${2 + Math.random() * 2}s ease-in-out infinite`
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
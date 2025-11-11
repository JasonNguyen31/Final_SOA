import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

interface AnimeCard {
	id: number
	title: string
	subtitle?: string
	image: string
	rating: number
	reviews: number
	episodes: number
	watching: number
	type: 'Drama' | 'Shounen' | 'Action' | 'Special'
	season: 'Spring' | 'Summer' | 'Fall' | 'Winter'
	isSpecial?: boolean
}

export const AnimeGrid = () => {
	const animeList: AnimeCard[] = [
		{
			id: 1,
			title: "Samurai Flamenco",
			image: "/images/samurai-flamenco.jpg",
			rating: 4.5,
			reviews: 12,
			episodes: 561,
			watching: 23,
			type: 'Drama',
			season: 'Spring'
		},
		{
			id: 2,
			title: "Strike the Blood",
			subtitle: "ストライク・ザ・ブラッド",
			image: "/images/strike-blood.jpg",
			rating: 3.5,
			reviews: 62,
			episodes: 341,
			watching: 13,
			type: 'Shounen',
			season: 'Summer'
		},
		{
			id: 3,
			title: "World Conquest Zvezda",
			subtitle: "征服",
			image: "/images/world-conquest.jpg",
			isSpecial: true,
			rating: 4.0,
			reviews: 21,
			episodes: 0,
			watching: 0,
			type: 'Special',
			season: 'Fall'
		},
		{
			id: 4,
			title: "Black Bullet",
			subtitle: "ブラック・ブレット",
			image: "/images/black-bullet.jpg",
			rating: 4.5,
			reviews: 87,
			episodes: 672,
			watching: 15,
			type: 'Action',
			season: 'Winter'
		}
	]

	const renderStars = (rating: number) => {
		return [...Array(5)].map((_, i) => (
			<Star
				key={i}
				className={`h-3 w-3 ${
					i < Math.floor(rating) 
						? 'fill-yellow-400 text-yellow-400' 
						: 'fill-gray-300 text-gray-300'
				}`}
			/>
		))
	}

	return (
		<section className="py-12 bg-gray-50">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center space-x-8">
						<Link to="/anime/airing" className="text-orange-500 font-semibold border-b-2 border-orange-500 pb-2">
							Airing now
						</Link>
						<Link to="/anime/spring" className="text-gray-600 hover:text-orange-500 transition-colors">
							Spring
						</Link>
						<Link to="/anime/summer" className="text-gray-600 hover:text-orange-500 transition-colors">
							Summer
						</Link>
						<Link to="/anime/fall" className="text-gray-600 hover:text-orange-500 transition-colors">
							Fall
						</Link>
						<Link to="/anime/winter" className="text-gray-600 hover:text-orange-500 transition-colors">
							Winter
						</Link>
					</div>
					<div className="flex items-center space-x-2">
						<button className="p-2 bg-orange-100 rounded hover:bg-orange-200 transition-colors">
							<svg className="h-5 w-5 text-orange-500" viewBox="0 0 24 24" fill="none">
								<rect x="4" y="4" width="7" height="7" fill="currentColor"/>
								<rect x="13" y="4" width="7" height="7" fill="currentColor"/>
								<rect x="4" y="13" width="7" height="7" fill="currentColor"/>
								<rect x="13" y="13" width="7" height="7" fill="currentColor"/>
							</svg>
						</button>
						<button className="p-2 hover:bg-gray-200 rounded transition-colors">
							<svg className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none">
								<rect x="4" y="5" width="16" height="3" fill="currentColor"/>
								<rect x="4" y="10.5" width="16" height="3" fill="currentColor"/>
								<rect x="4" y="16" width="16" height="3" fill="currentColor"/>
							</svg>
						</button>
					</div>
				</div>

				{/* Anime Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{animeList.map((anime) => (
						<Link 
							key={anime.id} 
							to={`/anime/${anime.id}`}
							className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
						>
							{/* Image Container with gradient background as placeholder */}
							<div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400">
								<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10" />
								
								{anime.isSpecial && (
									<div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-md text-xs font-semibold z-20">
										{anime.episodes}/16 episodes aired.
									</div>
								)}
								
								{/* Title Overlay */}
								<div className="absolute bottom-0 left-0 right-0 p-4 z-20">
									<h3 className="text-white font-bold text-lg mb-1">{anime.title}</h3>
									{anime.subtitle && (
										<p className="text-gray-200 text-sm">{anime.subtitle}</p>
									)}
								</div>
							</div>

							{/* Info Section */}
							<div className="p-4">
								<div className="flex items-center justify-between mb-2">
									<span className="text-xs text-gray-500 uppercase">{anime.type}</span>
									<span className="text-xs text-gray-500">{anime.season}</span>
								</div>
								
								{/* Rating */}
								<div className="flex items-center space-x-2 mb-3">
									<div className="flex">{renderStars(anime.rating)}</div>
									<span className="text-xs text-gray-600">({anime.reviews} reviews)</span>
								</div>
								
								{/* Stats */}
								<div className="flex items-center justify-between text-sm">
									<div className="text-center">
										<div className="font-bold text-gray-800">{anime.episodes}</div>
										<div className="text-xs text-gray-500">Watching</div>
									</div>
									<div className="text-center">
										<div className="font-bold text-gray-800">{anime.watching}</div>
										<div className="text-xs text-gray-500">Episodes</div>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	)
}

export default AnimeGrid
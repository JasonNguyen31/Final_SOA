import { Layout } from '@/components/layout/Layout'
import { HeroBanner } from '@/components/home/HeroBanner'
import { AnimeGrid } from '@/components/home/AnimeGrid'

const HomePage = () => {
	return (
		<Layout>
			{/* Hero Banner */}
			<HeroBanner />

			{/* Anime Grid Section */}
			<AnimeGrid />
		</Layout>
	)
}

export default HomePage

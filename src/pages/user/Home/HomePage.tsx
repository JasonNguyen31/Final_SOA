import { Layout } from '@/components/layout/Layout'
import { HeroBanner } from '@/components/home/HeroBanner'
import { ContentGrid } from '@/components/home/ContentGrid'

const HomePage = () => {
	return (
		<Layout>
			{/* Hero Banner */}
			<HeroBanner />

			{/* Anime Grid Section */}
			<ContentGrid />
		</Layout>
	)
}

export default HomePage

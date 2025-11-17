import { Layout } from '@/components/layout/Layout'
import { HeroBanner } from '@/components/home/HeroBanner'
import { ContentGrid } from '@/components/content/ContentGrid/ContentGrid'
import { usePageTitle } from '@/hooks/usePageTitle'

const HomePage = () => {
	usePageTitle('Home - Entertainment Platform')

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

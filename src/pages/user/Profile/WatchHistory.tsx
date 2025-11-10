import { Layout } from '@/components/layout'

const WatchHistory = () => {
	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Watch History</h1>
				<p className="text-gray-600">
					This page will show the user's watch history with all previously watched movies and viewing progress.
				</p>
			</div>
		</Layout>
	)
}

export default WatchHistory

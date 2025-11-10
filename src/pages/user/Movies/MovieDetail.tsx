import { Layout } from '@/components/layout'

const MovieDetail = () => {
	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Movie Detail</h1>
				<p className="text-gray-600">
					This page will show detailed information about a specific movie including description, reviews, and watch options.
				</p>
			</div>
		</Layout>
	)
}

export default MovieDetail

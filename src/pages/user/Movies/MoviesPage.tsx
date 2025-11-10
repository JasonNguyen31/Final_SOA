import { Layout } from '@/components/layout'

const MoviesPage = () => {
	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Movies</h1>
				<p className="text-gray-600">
					This page will display a collection of available movies with filters and search functionality.
				</p>
			</div>
		</Layout>
	)
}

export default MoviesPage

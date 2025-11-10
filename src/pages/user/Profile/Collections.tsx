import { Layout } from '@/components/layout'

const Collections = () => {
	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Collections</h1>
				<p className="text-gray-600">
					This page will display the user's saved collections of books and movies for easy access.
				</p>
			</div>
		</Layout>
	)
}

export default Collections

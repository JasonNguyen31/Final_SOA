import { Layout } from '@/components/layout'

const SearchPage = () => {
	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Search</h1>
				<p className="text-gray-600">
					This page will allow users to search for books and movies across the entire platform.
				</p>
			</div>
		</Layout>
	)
}

export default SearchPage

import { Layout } from '@/components/layout'

const MoviesManagement = () => {
	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Movies Management</h1>
				<p className="text-gray-600">
					This page will allow administrators to add, edit, and manage the movie catalog on the platform.
				</p>
			</div>
		</Layout>
	)
}

export default MoviesManagement

import { Layout } from '@/components/layout'

const ReportsPage = () => {
	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Reports</h1>
				<p className="text-gray-600">
					This page will display user-reported content and issues that require administrator attention and action.
				</p>
			</div>
		</Layout>
	)
}

export default ReportsPage

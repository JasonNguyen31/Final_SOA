import { Layout } from '@/components/layout'

const DashboardPage = () => {
	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
				<p className="text-gray-600">
					This page will display an overview of system statistics, recent activities, and key metrics for administrators.
				</p>
			</div>
		</Layout>
	)
}

export default DashboardPage

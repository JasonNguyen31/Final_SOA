import { Layout } from '@/components/layout'

const TransactionHistory = () => {
	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Transaction History</h1>
				<p className="text-gray-600">
					This page will show a detailed history of all wallet transactions and purchases made by the user.
				</p>
			</div>
		</Layout>
	)
}

export default TransactionHistory

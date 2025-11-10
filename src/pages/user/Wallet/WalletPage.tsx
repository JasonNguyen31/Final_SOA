import { Layout } from '@/components/layout'

const WalletPage = () => {
	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Wallet</h1>
				<p className="text-gray-600">
					This page will display the user's wallet balance and allow them to add funds or manage payment methods.
				</p>
			</div>
		</Layout>
	)
}

export default WalletPage

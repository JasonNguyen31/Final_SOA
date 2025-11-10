import { Layout } from '@/components/layout'

const VerifyOTPPage = () => {
	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Verify OTP</h1>
				<p className="text-gray-600">
					This page will allow users to enter the OTP code sent to their email for verification.
				</p>
			</div>
		</Layout>
	)
}

export default VerifyOTPPage

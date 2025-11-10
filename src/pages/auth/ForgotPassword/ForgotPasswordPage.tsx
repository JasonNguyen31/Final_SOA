import { Layout } from '@/components/layout'

const ForgotPasswordPage = () => {
	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Forgot Password</h1>
				<p className="text-gray-600">
					This page will allow users to reset their password by requesting an OTP verification.
				</p>
			</div>
		</Layout>
	)
}

export default ForgotPasswordPage

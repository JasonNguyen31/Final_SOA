import { Layout } from '@/components/layout'

const LoginPage = () => {
	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Login</h1>
				<p className="text-gray-600">
					This page will allow users to log in to their account with email and password.
				</p>
			</div>
		</Layout>
	)
}

export default LoginPage

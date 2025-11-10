import { Layout } from '@/components/layout'

const RegisterPage = () => {
	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Register</h1>
				<p className="text-gray-600">
					This page will allow new users to create an account with their personal information.
				</p>
			</div>
		</Layout>
	)
}

export default RegisterPage

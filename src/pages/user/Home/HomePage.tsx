import { Layout } from '@/components/layout'
import { Link } from 'react-router-dom'
import { Book, Film, Star, TrendingUp } from 'lucide-react'

const HomePage = () => {
	return (
		<Layout>
			{/* Hero Section */}
			<section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
				<div className="container mx-auto px-4 text-center">
					<h1 className="mb-6 text-5xl font-bold">Welcome to FinalSOA</h1>
					<p className="mb-8 text-xl">
						Discover thousands of books and movies at your fingertips
					</p>
					<div className="flex justify-center space-x-4">
						<Link
							to="/books"
							className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-all hover:bg-gray-100"
						>
							Browse Books
						</Link>
						<Link
							to="/movies"
							className="rounded-lg border-2 border-white px-8 py-3 font-semibold transition-all hover:bg-white hover:text-blue-600"
						>
							Watch Movies
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<h2 className="mb-12 text-center text-3xl font-bold">Why Choose Us?</h2>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
						<div className="text-center">
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900">
								<Book size={32} />
							</div>
							<h3 className="mb-2 text-xl font-semibold">Vast Library</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Access thousands of books and movies
							</p>
						</div>

						<div className="text-center">
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900">
								<Film size={32} />
							</div>
							<h3 className="mb-2 text-xl font-semibold">HD Streaming</h3>
							<p className="text-gray-600 dark:text-gray-400">
								High-quality streaming experience
							</p>
						</div>

						<div className="text-center">
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900">
								<Star size={32} />
							</div>
							<h3 className="mb-2 text-xl font-semibold">Premium Content</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Exclusive content for premium members
							</p>
						</div>

						<div className="text-center">
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900">
								<TrendingUp size={32} />
							</div>
							<h3 className="mb-2 text-xl font-semibold">Regular Updates</h3>
							<p className="text-gray-600 dark:text-gray-400">
								New content added regularly
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="bg-gray-100 py-16 dark:bg-gray-800">
				<div className="container mx-auto px-4 text-center">
					<h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
					<p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
						Join thousands of users enjoying our platform
					</p>
					<Link
						to="/auth/register"
						className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-700"
					>
						Sign Up Now
					</Link>
				</div>
			</section>
		</Layout>
	)
}

export default HomePage

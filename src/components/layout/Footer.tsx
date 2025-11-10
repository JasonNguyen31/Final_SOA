import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export const Footer = () => {
	const currentYear = new Date().getFullYear()

	return (
		<footer className="border-t bg-gray-50 dark:bg-gray-900">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					{/* Brand */}
					<div className="space-y-4">
						<h3 className="text-xl font-bold">FinalSOA</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Your ultimate platform for books and movies streaming.
						</p>
						<div className="flex space-x-4">
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary transition-colors"
							>
								<Facebook size={20} />
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary transition-colors"
							>
								<Twitter size={20} />
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary transition-colors"
							>
								<Instagram size={20} />
							</a>
							<a
								href="https://youtube.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary transition-colors"
							>
								<Youtube size={20} />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="mb-4 font-semibold">Quick Links</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link to="/books" className="text-gray-600 hover:text-primary dark:text-gray-400">
									Books
								</Link>
							</li>
							<li>
								<Link to="/movies" className="text-gray-600 hover:text-primary dark:text-gray-400">
									Movies
								</Link>
							</li>
							<li>
								<Link to="/premium" className="text-gray-600 hover:text-primary dark:text-gray-400">
									Premium
								</Link>
							</li>
							<li>
								<Link to="/search" className="text-gray-600 hover:text-primary dark:text-gray-400">
									Search
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h4 className="mb-4 font-semibold">Support</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
									Help Center
								</a>
							</li>
							<li>
								<a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
									Contact Us
								</a>
							</li>
							<li>
								<a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
									FAQs
								</a>
							</li>
							<li>
								<a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
									Terms of Service
								</a>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h4 className="mb-4 font-semibold">Legal</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
									Privacy Policy
								</a>
							</li>
							<li>
								<a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
									Cookie Policy
								</a>
							</li>
							<li>
								<a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
									DMCA
								</a>
							</li>
							<li>
								<a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
									Licensing
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-8 border-t pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
					<p>&copy; {currentYear} FinalSOA. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer

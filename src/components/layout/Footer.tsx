import { Link } from 'react-router-dom'
import { Facebook, Twitter } from 'lucide-react'

export const Footer = () => {
	const currentYear = new Date().getFullYear()

	return (
		<footer className="bg-gray-900 text-gray-300">
			{/* Main Footer */}
			<div className="container mx-auto px-4 py-12">
				<div className="flex flex-col lg:flex-row items-center justify-between">
					{/* Logo and Copyright */}
					<div className="flex items-center space-x-8 mb-6 lg:mb-0">
						<div className="text-2xl font-bold">
							<span className="text-3xl text-orange-500">7</span>
							<span className="text-white ml-2">ANIME</span>
							<span className="text-orange-500">NETWORK</span>
						</div>
					</div>

					{/* Navigation Links */}
					<div className="flex flex-wrap items-center justify-center gap-6 mb-6 lg:mb-0">
						<Link to="/news" className="hover:text-orange-500 transition-colors">
							News
						</Link>
						<Link to="/anime" className="hover:text-orange-500 transition-colors">
							Anime
						</Link>
						<Link to="/reviews" className="hover:text-orange-500 transition-colors">
							Reviews
						</Link>
						<Link to="/about" className="hover:text-orange-500 transition-colors">
							About
						</Link>
						<Link to="/contact" className="hover:text-orange-500 transition-colors">
							Contact
						</Link>
						<Link to="/privacy" className="hover:text-orange-500 transition-colors">
							Privacy Policy
						</Link>
						<Link to="/terms" className="hover:text-orange-500 transition-colors">
							Terms of Use
						</Link>
						<Link to="/sitemap" className="hover:text-orange-500 transition-colors">
							Sitemap
						</Link>
					</div>

					{/* Social Icons */}
					<div className="flex items-center space-x-4">
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
							aria-label="Facebook"
						>
							<Facebook className="h-5 w-5" />
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
							aria-label="Twitter"
						>
							<Twitter className="h-5 w-5" />
						</a>
						<a
							href="/rss"
							className="p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
							aria-label="RSS Feed"
						>
							<svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
								<path d="M3.429 5.1v2.4c7.248 0 13.114 5.886 13.114 13.142h2.4C18.943 12.18 11.862 5.1 3.429 5.1zm0 4.8v2.4a5.351 5.351 0 015.371 5.342h2.4c0-4.302-3.47-7.742-7.771-7.742zM6.171 15.642a1.371 1.371 0 11-2.742 0 1.371 1.371 0 012.742 0z" />
							</svg>
						</a>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-gray-800">
				<div className="container mx-auto px-4 py-4">
					<p className="text-center text-sm text-gray-500">
						Copyright © {currentYear} Anime Network. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer
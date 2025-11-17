import '@/styles/Footer.css'
import footerCoverImage from '@/assets/images/kl.jpg'

export const Footer = () => {
	const currentYear = new Date().getFullYear()

	return (
		<footer className="footer">
			{/* Background Image Cover toàn bộ footer */}
			<div className="footer-background">
				<img src={footerCoverImage} alt="footer background" />
			</div>

			<div className="footer-container">
				<div className="footer-content">
					{/* Logo Section */}
					<div className="footer-logo-wrapper">
						<a href="/" className="footer-logo">
							<div className="footer-logo-text-group">
								<div className="footer-logo-main">
									<span className="footer-logo-text">GENZ</span>
									<span className="footer-logo-network">MOBO</span>
								</div>
								<span className="footer-logo-japanese">映画と本の閲覧ウェブサイト</span>
							</div>
						</a>
					</div>

					{/* Privacy & Terms Links */}
					<div className="footer-links">
						<a href="/privacy" className="footer-link">Privacy Policy</a>
						<span className="footer-link-divider">|</span>
						<a href="/terms" className="footer-link">Terms of Use</a>
						<span className="footer-link-divider">|</span>
						<a href="/sitemap" className="footer-link">Sitemap</a>
					</div>
				</div>

				{/* Copyright */}
				<div className="footer-bottom">
					<p className="footer-copyright">
						Copyright © {currentYear} GENZMOBO. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer
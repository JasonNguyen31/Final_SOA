import { createPortal } from 'react-dom'
import { X, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './PremiumUpgradeModal.css'

interface PremiumUpgradeModalProps {
	isOpen: boolean
	onClose: () => void
}

export const PremiumUpgradeModal = ({ isOpen, onClose }: PremiumUpgradeModalProps) => {
	const navigate = useNavigate()

	if (!isOpen) return null

	const handleUpgrade = () => {
		onClose()
		navigate('/premium')
	}

	const modalContent = (
		<div className="modal-overlay" onClick={onClose}>
			<div className="premium-upgrade-modal" onClick={(e) => e.stopPropagation()}>
				<button className="modal-close-btn" onClick={onClose}>
					<X size={24} />
				</button>

				<div className="premium-upgrade-content">
					<div className="premium-icon-wrapper">
						<Crown size={64} className="premium-icon" />
					</div>

					<h2 className="premium-title">Premium Content</h2>
					<p className="premium-message">
						You need to upgrade to Premium to watch this content.
					</p>

					<div className="premium-features">
						<div className="feature-item">
							<Crown size={20} />
							<span>Access to all premium movies and shows</span>
						</div>
						<div className="feature-item">
							<Crown size={20} />
							<span>Watch in HD and 4K quality</span>
						</div>
						<div className="feature-item">
							<Crown size={20} />
							<span>Ad-free experience</span>
						</div>
					</div>

					<div className="premium-actions">
						<button className="btn-upgrade" onClick={handleUpgrade}>
							Upgrade to Premium
						</button>
						<button className="btn-cancel" onClick={onClose}>
							Maybe Later
						</button>
					</div>
				</div>
			</div>
		</div>
	)

	return createPortal(modalContent, document.body)
}

export default PremiumUpgradeModal

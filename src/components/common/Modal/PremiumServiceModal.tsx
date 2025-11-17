import { createPortal } from 'react-dom'
import { X, Crown, Check, Zap, Star, Film, Book } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import './PremiumServiceModal.css'

interface PremiumServiceModalProps {
	isOpen: boolean
	onClose: () => void
}

export const PremiumServiceModal = ({ isOpen, onClose }: PremiumServiceModalProps) => {
	const { user } = useAuth()
	const navigate = useNavigate()

	if (!isOpen) return null

	const handleSubscribe = () => {
		onClose()
		navigate('/premium')
	}

	// Calculate next billing date from premiumExpiresAt
	const getNextBillingDate = () => {
		if (!user?.premiumExpiresAt) return 'N/A'
		return new Date(user.premiumExpiresAt).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		})
	}

	const premiumFeatures = [
		{ icon: Film, title: 'Unlimited Movies & Shows', description: 'Access to all premium content library' },
		{ icon: Book, title: 'Exclusive Books & Manga', description: 'Read premium books and manga collections' },
		{ icon: Zap, title: 'Ad-Free Experience', description: 'Enjoy content without interruptions' },
		{ icon: Star, title: '4K Ultra HD Quality', description: 'Watch in the highest quality available' },
		{ icon: Crown, title: 'Early Access', description: 'Get new releases before everyone else' },
		{ icon: Check, title: 'Download & Offline', description: 'Download content to watch offline' },
	]

	const subscriptionPlans = [
		{ id: 'monthly', name: 'Monthly Plan', price: 99000, period: '/month', popular: false },
		{ id: 'quarterly', name: 'Quarterly Plan', price: 249000, period: '/3 months', popular: true, save: '15% OFF' },
		{ id: 'yearly', name: 'Yearly Plan', price: 899000, period: '/year', popular: false, save: '25% OFF' },
	]

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
	}

	const modalContent = (
		<div className="modal-overlay" onClick={onClose}>
			<div className="premium-service-modal" onClick={(e) => e.stopPropagation()}>
				<button className="modal-close-btn" onClick={onClose}>
					<X size={24} />
				</button>

				<div className="premium-service-content">
					{/* Header */}
					<div className="premium-service-header">
						<div className="premium-crown-wrapper">
							<Crown size={48} className="premium-crown-icon" />
						</div>
						<h2 className="premium-service-title">Premium Service</h2>
						{user?.isPremium ? (
							<div className="premium-status-active">
								<Check size={20} />
								<span>Active Premium Member</span>
							</div>
						) : (
							<p className="premium-service-subtitle">
								Unlock unlimited entertainment with Premium
							</p>
						)}
					</div>

					{/* Features Grid */}
					<div className="premium-features-grid">
						{premiumFeatures.map((feature, index) => (
							<div key={index} className="premium-feature-card">
								<feature.icon size={32} className="feature-icon" />
								<h3 className="feature-title">{feature.title}</h3>
								<p className="feature-description">{feature.description}</p>
							</div>
						))}
					</div>

					{/* Subscription Plans */}
					{!user?.isPremium && (
						<div className="subscription-plans">
							<h3 className="plans-title">Choose Your Plan</h3>
							<div className="plans-grid">
								{subscriptionPlans.map((plan) => (
									<div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
										{plan.popular && <div className="plan-badge">Most Popular</div>}
										{plan.save && <div className="plan-save-badge">{plan.save}</div>}
										<h4 className="plan-name">{plan.name}</h4>
										<div className="plan-price">
											<span className="price-amount">{formatCurrency(plan.price)}</span>
											<span className="price-period">{plan.period}</span>
										</div>
										<button className="btn-subscribe" onClick={handleSubscribe}>Subscribe Now</button>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Current Subscription (for premium users) */}
					{user?.isPremium && (
						<div className="current-subscription">
							<h3 className="subscription-title">Your Subscription</h3>
							<div className="subscription-info-card">
								<div className="subscription-detail">
									<span className="subscription-label">Plan</span>
									<span className="subscription-value">Premium Monthly</span>
								</div>
								<div className="subscription-detail">
									<span className="subscription-label">Status</span>
									<span className="subscription-value active">Active</span>
								</div>
								<div className="subscription-detail">
									<span className="subscription-label">Next Billing</span>
									<span className="subscription-value">{getNextBillingDate()}</span>
								</div>
								<div className="subscription-detail">
									<span className="subscription-label">Auto Renewal</span>
									<span className="subscription-value">Enabled</span>
								</div>
							</div>
							<div className="subscription-actions">
								<button className="btn-manage" onClick={handleSubscribe}>Manage Subscription</button>
								<button className="btn-cancel">Cancel Premium</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)

	return createPortal(modalContent, document.body)
}

export default PremiumServiceModal

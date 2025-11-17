import { Layout } from '@/components/layout'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { userService } from '@/services/user/userService'
import { Check, Sparkles, Crown, Zap } from 'lucide-react'
import type { PremiumPackage } from '@/types/user.types'
import { NotificationModal } from '@/components/common/Modal/NotificationModal'
import type { NotificationType } from '@/components/common/Modal/NotificationModal'
import '@/styles/PremiumPage.css'

const PremiumPage = () => {
	const { user, updateUser } = useAuth()
	const [isProcessing, setIsProcessing] = useState(false)
	const [currentBalance, setCurrentBalance] = useState(0)
	const [premiumExpiresAt, setPremiumExpiresAt] = useState<string | null>(null)
	const [isPremium, setIsPremium] = useState(false)

	// Notification modal state
	const [showNotification, setShowNotification] = useState(false)
	const [notificationType, setNotificationType] = useState<NotificationType>('info')
	const [notificationTitle, setNotificationTitle] = useState<string>('')
	const [notificationMessage, setNotificationMessage] = useState<string>('')
	const [showConfirm, setShowConfirm] = useState(false)
	const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null)

	useEffect(() => {
		// Fetch latest wallet balance and premium status
		const fetchBalance = async () => {
			try {
				const profile = await userService.getProfile()
				console.log('[PremiumPage] Fetched profile:', profile)
				console.log('[PremiumPage] Wallet balance:', profile.walletBalance)
				setCurrentBalance(profile.walletBalance || 0)
				setIsPremium(profile.isPremium || false)
				setPremiumExpiresAt(profile.premiumExpiresAt || null)
				updateUser(profile as any)
			} catch (error) {
				console.error('Failed to fetch profile:', error)
				console.log('[PremiumPage] Using fallback balance:', user?.walletBalance)
				setCurrentBalance(user?.walletBalance || 0)
				setIsPremium(user?.isPremium || false)
				setPremiumExpiresAt(user?.premiumExpiresAt || null)
			}
		}
		fetchBalance()
	}, [])

	const premiumPackages: PremiumPackage[] = [
		{
			id: '1month',
			name: '1 Month',
			duration: 1,
			price: 99000,
			features: [
				'Ad-free streaming',
				'HD quality playback',
				'Unlimited downloads',
				'Access to premium content',
				'Priority customer support'
			]
		},
		{
			id: '3months',
			name: '3 Months',
			duration: 3,
			price: 249000,
			features: [
				'All 1-month features',
				'Save 16% compared to monthly',
				'Early access to new releases',
				'Exclusive premium badge',
				'Family sharing (up to 3 devices)'
			],
			popular: true
		},
		{
			id: '6months',
			name: '6 Months',
			duration: 6,
			price: 449000,
			features: [
				'All 3-month features',
				'Save 25% compared to monthly',
				'VIP customer support',
				'Exclusive content previews',
				'Premium community access'
			]
		}
	]

	const handleUpgrade = async (pkg: PremiumPackage) => {
		if (isProcessing) return

		if (currentBalance < pkg.price) {
			showNotificationModal('error', 'Insufficient balance! Please check your wallet.', 'Insufficient Balance')
			return
		}

		if (user?.isPremium) {
			showConfirmModal(
				`You already have a premium account. Do you want to renew with ${pkg.name} package?`,
				() => processPremiumUpgrade(pkg),
				'Renew Premium'
			)
			return
		}

		processPremiumUpgrade(pkg)
	}

	const processPremiumUpgrade = async (pkg: PremiumPackage) => {
		setIsProcessing(true)

		try {
			// Call API to upgrade premium
			const updatedUser = await userService.upgradePremium(pkg.duration, pkg.price)

			// Update local user state
			updateUser(updatedUser as any)

			// Update balance and premium status display
			setCurrentBalance(updatedUser.walletBalance || 0)
			setIsPremium(updatedUser.isPremium || false)
			setPremiumExpiresAt(updatedUser.premiumExpiresAt || null)

			const expiryDate = updatedUser.premiumExpiresAt
				? new Date(updatedUser.premiumExpiresAt).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})
				: 'N/A'

			const successMessage = `Successfully ${isPremium ? 'extended' : 'upgraded to'} Premium ${pkg.name}!\n\nNew balance: ${formatCurrency(updatedUser.walletBalance || 0)}\nPremium until: ${expiryDate}`

			showNotificationModal('success', successMessage, 'Premium Upgraded')

			// Refresh page to show updated status after a delay
			setTimeout(() => {
				window.location.reload()
			}, 2000)
		} catch (error: any) {
			console.error('Failed to upgrade:', error)
			const errorMessage = error.response?.data?.message || 'Failed to upgrade. Please try again.'
			showNotificationModal('error', errorMessage, 'Upgrade Failed')
		} finally {
			setIsProcessing(false)
		}
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
	}

	// Helper functions to show notifications
	const showNotificationModal = (
		type: NotificationType,
		message: string,
		title?: string
	) => {
		setNotificationType(type)
		setNotificationMessage(message)
		setNotificationTitle(title || '')
		setShowConfirm(false)
		setConfirmCallback(null)
		setShowNotification(true)
	}

	const showConfirmModal = (
		message: string,
		onConfirm: () => void,
		title?: string
	) => {
		setNotificationType('warning')
		setNotificationMessage(message)
		setNotificationTitle(title || 'Confirm Action')
		setShowConfirm(true)
		setConfirmCallback(() => onConfirm)
		setShowNotification(true)
	}

	const closeNotification = () => {
		setShowNotification(false)
		setConfirmCallback(null)
	}

	return (
		<Layout>
			<NotificationModal
				isOpen={showNotification}
				onClose={closeNotification}
				type={notificationType}
				title={notificationTitle}
				message={notificationMessage}
				showCancel={showConfirm}
				onConfirm={confirmCallback || undefined}
			/>
			<div className="premium-page">
				<div className="premium-hero">
					<div className="premium-hero-content">
						<Crown className="premium-hero-icon" size={60} />
						<h1 className="premium-hero-title">Upgrade to Premium</h1>
						<p className="premium-hero-subtitle">
							Unlock unlimited entertainment with exclusive features and content
						</p>
					</div>
				</div>

				<div className="premium-packages-container">
					{/* Premium Status Info */}
					{isPremium && premiumExpiresAt && (
						<div className="premium-status-info">
							<Crown size={24} />
							<div>
								<p className="status-title">Premium Active</p>
								<p className="status-expiry">
									Valid until: <strong>
										{new Date(premiumExpiresAt).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})}
									</strong>
								</p>
							</div>
						</div>
					)}

					<div className="premium-packages-grid">
						{premiumPackages.map((pkg) => (
							<div
								key={pkg.id}
								className={`premium-package-card ${pkg.popular ? 'popular' : ''}`}
							>
								{pkg.popular && (
									<div className="package-popular-badge">
										<Sparkles size={16} />
										Most Popular
									</div>
								)}

								<div className="package-header">
									{pkg.duration === 1 && <Zap className="package-icon" size={40} />}
									{pkg.duration === 3 && <Crown className="package-icon" size={40} />}
									{pkg.duration === 6 && <Sparkles className="package-icon" size={40} />}
									<h3 className="package-name">{pkg.name}</h3>
									<div className="package-price">
										<span className="price-amount">{formatCurrency(pkg.price)}</span>
										<span className="price-duration">/{pkg.duration} month{pkg.duration > 1 ? 's' : ''}</span>
									</div>
								</div>

								<ul className="package-features">
									{pkg.features.map((feature, index) => (
										<li key={index} className="package-feature">
											<Check size={20} className="feature-icon" />
											<span>{feature}</span>
										</li>
									))}
								</ul>

								<button
									className="package-buy-btn"
									onClick={() => handleUpgrade(pkg)}
									disabled={isProcessing}
								>
									{isProcessing ? 'Processing...' : (isPremium ? 'Extend Premium' : 'Upgrade Now')}
								</button>
							</div>
						))}
					</div>

					<div className="premium-wallet-info">
						<p className="wallet-balance">
							Your wallet balance: <strong>{formatCurrency(currentBalance)}</strong>
						</p>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default PremiumPage

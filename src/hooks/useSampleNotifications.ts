import type { Notification } from '@/types/notification.types'

/**
 * Hook to generate sample notifications for demonstration
 */
export const useSampleNotifications = () => {
	const generateSampleNotifications = (): Notification[] => {
		const now = new Date()
		const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
		const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000)
		const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

		return [
			{
				id: 'notif-1',
				userId: 'user-1',
				type: 'purchase',
				title: '🎉 Premium Upgrade Successful',
				message: 'Congratulations! You have successfully upgraded to Premium Plan. Enjoy unlimited collections and exclusive features.',
				data: {
					premiumPlanId: 'plan-premium',
					premiumExpiry: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
					planName: 'Premium Annual',
					amount: 99.99
				},
				read: false,
				createdAt: twoHoursAgo.toISOString(),
				actionUrl: '/premium'
			},
			{
				id: 'notif-2',
				userId: 'user-1',
				type: 'wallet',
				title: '💳 Wallet Balance Updated',
				message: 'Your wallet has been credited with $50.00 from your premium subscription refund.',
				data: {
					walletBalance: 150.50,
					amount: 50.00,
					transactionType: 'credit'
				},
				read: false,
				createdAt: twoHoursAgo.toISOString(),
				actionUrl: '/wallet'
			},
			{
				id: 'notif-3',
				userId: 'user-1',
				type: 'new_content',
				title: '📺 New Episode Released: Attack on Titan',
				message: 'Season 4, Episode 28 "The Dawn of Humanity" is now available to watch.',
				data: {
					contentId: 'movie-123',
					contentTitle: 'Attack on Titan Season 4 Episode 28',
					contentImage: 'https://via.placeholder.com/200',
					episodeNumber: 28,
					season: 4
				},
				read: false,
				createdAt: fiveHoursAgo.toISOString(),
				actionUrl: '/movies/movie-123/watch'
			},
			{
				id: 'notif-4',
				userId: 'user-1',
				type: 'recommendation',
				title: '✨ Recommended for You: Demon Slayer',
				message: 'Based on your watching history, you might enjoy Demon Slayer: Kimetsu no Yaiba. Start watching now!',
				data: {
					contentId: 'movie-456',
					contentTitle: 'Demon Slayer: Kimetsu no Yaiba',
					contentImage: 'https://via.placeholder.com/200',
					matchPercentage: 95,
					reason: 'You watched similar anime'
				},
				read: true,
				createdAt: oneDayAgo.toISOString(),
				actionUrl: '/movies/movie-456'
			},
			{
				id: 'notif-5',
				userId: 'user-1',
				type: 'update',
				title: '🔔 App Update Available',
				message: 'Version 2.1.0 is now available with new features and improvements. Download now!',
				data: {
					version: '2.1.0',
					changes: ['New collection features', 'Improved search', 'Bug fixes']
				},
				read: true,
				createdAt: oneDayAgo.toISOString()
			}
		]
	}

	return {
		generateSampleNotifications,
	}
}

export default useSampleNotifications

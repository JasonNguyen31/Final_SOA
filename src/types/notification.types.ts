export type NotificationType = 'purchase' | 'wallet' | 'new_content' | 'recommendation' | 'update' | 'system'

export interface Notification {
	id: string
	userId: string
	type: NotificationType
	title: string
	message: string
	data?: {
		contentId?: string
		contentTitle?: string
		contentImage?: string
		amount?: number
		walletBalance?: number
		premiumPlanId?: string
		premiumExpiry?: string
		[key: string]: any
	}
	read: boolean
	createdAt: string
	updatedAt?: string
	actionUrl?: string
	expiresAt?: string
}

export interface CreateNotificationDto {
	type: NotificationType
	title: string
	message: string
	data?: Record<string, any>
	actionUrl?: string
}

export interface NotificationPreference {
	userId: string
	purchaseNotifications: boolean
	walletNotifications: boolean
	newContentNotifications: boolean
	recommendationNotifications: boolean
	systemNotifications: boolean
}

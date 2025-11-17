/**
 * Notification Service
 * Handles all notification-related API calls
 */

import axios from 'axios'
import { tokenService } from '@/services/auth/tokenService'
import { BACKEND_CONFIG } from '@/config/backend.config'
import type { Notification, CreateNotificationDto, NotificationPreference } from '@/types/notification.types'

// Notification service base URL
const NOTIFICATION_API_BASE = BACKEND_CONFIG.COLLECTION_SERVICE.BASE_URL // Using collection service for now

// Helper function to get auth headers
const getAuthHeaders = () => {
	const token = tokenService.getAccessToken()
	return {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	}
}

export const notificationService = {
	/**
	 * Get user notifications
	 */
	getNotifications: async (page: number = 1, limit: number = 20): Promise<{ notifications: Notification[]; total: number }> => {
		try {
			const response = await axios.get<{success: boolean, data: {notifications: Notification[], total: number}}>(
				`${NOTIFICATION_API_BASE}/api/notifications`,
				{
					params: { page, limit },
					...getAuthHeaders(),
				}
			)
			return response.data.data
		} catch (error) {
			console.error('Failed to fetch notifications:', error)
			throw error
		}
	},

	/**
	 * Get unread notification count
	 */
	getUnreadCount: async (): Promise<number> => {
		try {
			const response = await axios.get<{success: boolean, data: {count: number}}>(
				`${NOTIFICATION_API_BASE}/api/notifications/unread/count`,
				getAuthHeaders()
			)
			return response.data.data.count
		} catch (error) {
			console.error('Failed to fetch unread count:', error)
			throw error
		}
	},

	/**
	 * Mark notification as read
	 */
	markAsRead: async (notificationId: string): Promise<Notification> => {
		try {
			const response = await axios.patch<{success: boolean, data: Notification}>(
				`${NOTIFICATION_API_BASE}/api/notifications/${notificationId}/read`,
				{},
				getAuthHeaders()
			)
			return response.data.data
		} catch (error) {
			console.error('Failed to mark notification as read:', error)
			throw error
		}
	},

	/**
	 * Mark all notifications as read
	 */
	markAllAsRead: async (): Promise<void> => {
		try {
			await axios.patch(
				`${NOTIFICATION_API_BASE}/api/notifications/read-all`,
				{},
				getAuthHeaders()
			)
		} catch (error) {
			console.error('Failed to mark all as read:', error)
			throw error
		}
	},

	/**
	 * Delete a notification
	 */
	deleteNotification: async (notificationId: string): Promise<void> => {
		try {
			await axios.delete(
				`${NOTIFICATION_API_BASE}/api/notifications/${notificationId}`,
				getAuthHeaders()
			)
		} catch (error) {
			console.error('Failed to delete notification:', error)
			throw error
		}
	},

	/**
	 * Clear all notifications
	 */
	clearAll: async (): Promise<void> => {
		try {
			await axios.delete(
				`${NOTIFICATION_API_BASE}/api/notifications/clear-all`,
				getAuthHeaders()
			)
		} catch (error) {
			console.error('Failed to clear notifications:', error)
			throw error
		}
	},

	/**
	 * Create a test notification (for testing purposes)
	 */
	createTestNotification: async (data: CreateNotificationDto): Promise<Notification> => {
		try {
			const response = await axios.post<{success: boolean, data: Notification}>(
				`${NOTIFICATION_API_BASE}/api/notifications/test`,
				data,
				getAuthHeaders()
			)
			return response.data.data
		} catch (error) {
			console.error('Failed to create test notification:', error)
			throw error
		}
	},

	/**
	 * Get notification preferences
	 */
	getPreferences: async (): Promise<NotificationPreference> => {
		try {
			const response = await axios.get<{success: boolean, data: NotificationPreference}>(
				`${NOTIFICATION_API_BASE}/api/notifications/preferences`,
				getAuthHeaders()
			)
			return response.data.data
		} catch (error) {
			console.error('Failed to fetch preferences:', error)
			throw error
		}
	},

	/**
	 * Update notification preferences
	 */
	updatePreferences: async (preferences: Partial<NotificationPreference>): Promise<NotificationPreference> => {
		try {
			const response = await axios.patch<{success: boolean, data: NotificationPreference}>(
				`${NOTIFICATION_API_BASE}/api/notifications/preferences`,
				preferences,
				getAuthHeaders()
			)
			return response.data.data
		} catch (error) {
			console.error('Failed to update preferences:', error)
			throw error
		}
	},
}

export default notificationService

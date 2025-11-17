import { createPortal } from 'react-dom'
import { X, Bell, Trash2, MoreVertical, Check, AlertCircle, Zap, Lightbulb, Package } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { notificationService } from '@/services/interaction/notificationService'
import type { Notification } from '@/types/notification.types'
import './NotificationCenterModal.css'

interface NotificationCenterModalProps {
	isOpen: boolean
	onClose: () => void
}

export const NotificationCenterModal = ({ isOpen, onClose }: NotificationCenterModalProps) => {
	const navigate = useNavigate()
	const [notifications, setNotifications] = useState<Notification[]>([])
	const [loading, setLoading] = useState(true)
	const [unreadCount, setUnreadCount] = useState(0)

	useEffect(() => {
		if (isOpen) {
			loadNotifications()
		}
	}, [isOpen])

	const loadNotifications = async () => {
		try {
			setLoading(true)
			const data = await notificationService.getNotifications(1, 50)
			setNotifications(data.notifications)

			const unread = data.notifications.filter(n => !n.read).length
			setUnreadCount(unread)
		} catch (error) {
			console.error('Failed to load notifications:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleMarkAsRead = async (notificationId: string) => {
		try {
			await notificationService.markAsRead(notificationId)
			setNotifications(prev =>
				prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
			)
			setUnreadCount(prev => Math.max(0, prev - 1))
		} catch (error) {
			console.error('Failed to mark as read:', error)
		}
	}

	const handleMarkAllAsRead = async () => {
		try {
			await notificationService.markAllAsRead()
			setNotifications(prev => prev.map(n => ({ ...n, read: true })))
			setUnreadCount(0)
		} catch (error) {
			console.error('Failed to mark all as read:', error)
		}
	}

	const handleDelete = async (notificationId: string) => {
		try {
			await notificationService.deleteNotification(notificationId)
			setNotifications(prev => prev.filter(n => n.id !== notificationId))
		} catch (error) {
			console.error('Failed to delete notification:', error)
		}
	}

	const handleClearAll = async () => {
		if (confirm('Are you sure you want to clear all notifications?')) {
			try {
				await notificationService.clearAll()
				setNotifications([])
				setUnreadCount(0)
			} catch (error) {
				console.error('Failed to clear notifications:', error)
			}
		}
	}

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'purchase':
				return <Package size={20} className="notification-icon purchase" />
			case 'wallet':
				return <Zap size={20} className="notification-icon wallet" />
			case 'new_content':
				return <AlertCircle size={20} className="notification-icon new-content" />
			case 'recommendation':
				return <Lightbulb size={20} className="notification-icon recommendation" />
			default:
				return <Bell size={20} className="notification-icon" />
		}
	}

	const handleNotificationClick = (notification: Notification) => {
		if (!notification.read) {
			handleMarkAsRead(notification.id)
		}
		if (notification.actionUrl) {
			onClose()
			navigate(notification.actionUrl)
		}
	}

	if (!isOpen) return null

	const modalContent = (
		<div className="notification-overlay" onClick={onClose}>
			<div className="notification-modal" onClick={(e) => e.stopPropagation()}>
				<div className="notification-header">
					<div className="notification-title-section">
						<Bell size={28} className="notification-modal-icon" />
						<div>
							<h2 className="notification-title">Notifications</h2>
							{unreadCount > 0 && (
								<span className="unread-badge">{unreadCount} new</span>
							)}
						</div>
					</div>
					<button className="close-btn" onClick={onClose}>
						<X size={24} />
					</button>
				</div>

				<div className="notification-actions">
					{unreadCount > 0 && (
						<button className="action-btn" onClick={handleMarkAllAsRead}>
							<Check size={16} /> Mark all as read
						</button>
					)}
					{notifications.length > 0 && (
						<button className="action-btn danger" onClick={handleClearAll}>
							<Trash2 size={16} /> Clear all
						</button>
					)}
				</div>

				<div className="notification-list">
					{loading ? (
						<div className="notification-loading">
							<div className="spinner"></div>
							<p>Loading notifications...</p>
						</div>
					) : notifications.length === 0 ? (
						<div className="notification-empty">
							<Bell size={64} className="empty-icon" />
							<h3>No notifications</h3>
							<p>You're all caught up!</p>
						</div>
					) : (
						notifications.map(notification => (
							<div
								key={notification.id}
								className={`notification-item ${!notification.read ? 'unread' : ''}`}
								onClick={() => handleNotificationClick(notification)}
							>
								<div className="notification-icon-wrapper">
									{getNotificationIcon(notification.type)}
									{!notification.read && <span className="unread-indicator"></span>}
								</div>

								<div className="notification-content">
									<h4 className="notification-item-title">{notification.title}</h4>
									<p className="notification-item-message">{notification.message}</p>
									<span className="notification-time">
										{new Date(notification.createdAt).toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
										})}
									</span>
								</div>

								<button
									className="delete-notification-btn"
									onClick={(e) => {
										e.stopPropagation()
										handleDelete(notification.id)
									}}
									title="Delete"
								>
									<Trash2 size={16} />
								</button>
							</div>
						))
					)}
				</div>

				<div className="notification-footer">
					<button className="view-all-btn" onClick={() => {
						onClose()
						navigate('/notifications')
					}}>
						View all notifications →
					</button>
				</div>
			</div>
		</div>
	)

	return createPortal(modalContent, document.body)
}

export default NotificationCenterModal

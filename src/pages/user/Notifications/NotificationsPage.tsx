import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ArrowLeft, Trash2, Check, CheckCircle, Package, Zap, Lightbulb, AlertCircle } from 'lucide-react'
import { notificationService } from '@/services/interaction/notificationService'
import { useSampleNotifications } from '@/hooks/useSampleNotifications'
import type { Notification } from '@/types/notification.types'
import './NotificationsPage.css'

export const NotificationsPage = () => {
	const navigate = useNavigate()
	const { generateSampleNotifications } = useSampleNotifications()
	const [notifications, setNotifications] = useState<Notification[]>([])
	const [loading, setLoading] = useState(true)
	const [filter, setFilter] = useState<'all' | 'unread'>('all')

	useEffect(() => {
		loadNotifications()
	}, [])

	const loadNotifications = async () => {
		try {
			setLoading(true)
			// For demo purposes, use sample notifications
			const sampleNotifications = generateSampleNotifications()
			setNotifications(sampleNotifications)
		} catch (error) {
			console.error('Failed to load notifications:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleMarkAsRead = async (notificationId: string) => {
		try {
			setNotifications(prev =>
				prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
			)
		} catch (error) {
			console.error('Failed to mark as read:', error)
		}
	}

	const handleDelete = async (notificationId: string) => {
		try {
			setNotifications(prev => prev.filter(n => n.id !== notificationId))
		} catch (error) {
			console.error('Failed to delete notification:', error)
		}
	}

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'purchase':
				return <Package size={24} className="notification-icon purchase" />
			case 'wallet':
				return <Zap size={24} className="notification-icon wallet" />
			case 'new_content':
				return <AlertCircle size={24} className="notification-icon new-content" />
			case 'recommendation':
				return <Lightbulb size={24} className="notification-icon recommendation" />
			default:
				return <Bell size={24} className="notification-icon" />
		}
	}

	const filteredNotifications = filter === 'unread'
		? notifications.filter(n => !n.read)
		: notifications

	const unreadCount = notifications.filter(n => !n.read).length

	return (
		<div className="notifications-page">
			<div className="notifications-container">
				<div className="notifications-page-header">
					<button className="back-btn" onClick={() => navigate(-1)}>
						<ArrowLeft size={24} />
					</button>
					<div className="header-content">
						<h1>Notifications</h1>
						{unreadCount > 0 && (
							<span className="unread-count">{unreadCount} unread</span>
						)}
					</div>
				</div>

				<div className="notifications-filters">
					<button
						className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
						onClick={() => setFilter('all')}
					>
						All ({notifications.length})
					</button>
					<button
						className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
						onClick={() => setFilter('unread')}
					>
						Unread ({unreadCount})
					</button>
				</div>

				<div className="notifications-content">
					{loading ? (
						<div className="notifications-loading">
							<div className="spinner"></div>
							<p>Loading notifications...</p>
						</div>
					) : filteredNotifications.length === 0 ? (
						<div className="notifications-empty">
							<Bell size={80} className="empty-icon" />
							<h3>No {filter === 'unread' ? 'unread' : ''} notifications</h3>
							<p>You're all caught up!</p>
						</div>
					) : (
						<div className="notifications-list">
							{filteredNotifications.map(notification => (
								<div
									key={notification.id}
									className={`notification-card ${!notification.read ? 'unread' : ''}`}
								>
									<div className="notification-card-icon">
										{getNotificationIcon(notification.type)}
									</div>

									<div className="notification-card-content">
										<h3 className="notification-card-title">{notification.title}</h3>
										<p className="notification-card-message">{notification.message}</p>
										<div className="notification-card-meta">
											<span className="notification-type">{notification.type.replace('_', ' ').toUpperCase()}</span>
											<span className="notification-time">
												{new Date(notification.createdAt).toLocaleDateString('en-US', {
													month: 'short',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
												})}
											</span>
										</div>

										{notification.actionUrl && (
											<button
												className="notification-action-btn"
												onClick={() => {
													if (!notification.read) {
														handleMarkAsRead(notification.id)
													}
													navigate(notification.actionUrl!)
												}}
											>
												View Details →
											</button>
										)}
									</div>

									<div className="notification-card-actions">
										{!notification.read && (
											<button
												className="action-icon-btn"
												title="Mark as read"
												onClick={() => handleMarkAsRead(notification.id)}
											>
												<CheckCircle size={20} />
											</button>
										)}
										<button
											className="action-icon-btn delete"
											title="Delete"
											onClick={() => handleDelete(notification.id)}
										>
											<Trash2 size={20} />
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default NotificationsPage

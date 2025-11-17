import { createPortal } from 'react-dom'
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import './NotificationModal.css'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotificationModalProps {
	isOpen: boolean
	onClose: () => void
	type?: NotificationType
	title?: string
	message: string
	confirmText?: string
	cancelText?: string
	onConfirm?: () => void
	showCancel?: boolean
}

export const NotificationModal = ({
	isOpen,
	onClose,
	type = 'info',
	title,
	message,
	confirmText = 'OK',
	cancelText = 'Cancel',
	onConfirm,
	showCancel = false
}: NotificationModalProps) => {
	if (!isOpen) return null

	const handleConfirm = () => {
		if (onConfirm) {
			onConfirm()
		}
		onClose()
	}

	const getIcon = () => {
		switch (type) {
			case 'success':
				return <CheckCircle size={48} className="notification-icon success" />
			case 'error':
				return <XCircle size={48} className="notification-icon error" />
			case 'warning':
				return <AlertCircle size={48} className="notification-icon warning" />
			case 'info':
			default:
				return <Info size={48} className="notification-icon info" />
		}
	}

	const getTitle = () => {
		if (title) return title
		switch (type) {
			case 'success':
				return 'Success'
			case 'error':
				return 'Error'
			case 'warning':
				return 'Warning'
			case 'info':
			default:
				return 'Information'
		}
	}

	const modalContent = (
		<div className="notification-modal-overlay" onClick={showCancel ? undefined : onClose}>
			<div className="notification-modal" onClick={(e) => e.stopPropagation()}>
				<button className="notification-close-btn" onClick={onClose}>
					<X size={20} />
				</button>

				<div className="notification-content">
					{getIcon()}
					<h2 className="notification-title">{getTitle()}</h2>
					<p className="notification-message">{message}</p>

					<div className="notification-actions">
						{showCancel && (
							<button className="notification-btn notification-btn-cancel" onClick={onClose}>
								{cancelText}
							</button>
						)}
						<button
							className={`notification-btn notification-btn-confirm ${type}`}
							onClick={handleConfirm}
						>
							{confirmText}
						</button>
					</div>
				</div>
			</div>
		</div>
	)

	return createPortal(modalContent, document.body)
}

export default NotificationModal

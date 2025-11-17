import { type ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import './Modal.css'

export interface ModalProps {
	isOpen: boolean
	onClose: () => void
	title?: string
	children: ReactNode
	size?: 'small' | 'medium' | 'large' | 'fullscreen'
	showCloseButton?: boolean
	closeOnOverlayClick?: boolean
	closeOnEsc?: boolean
	footer?: ReactNode
	className?: string
}

export const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	size = 'medium',
	showCloseButton = true,
	closeOnOverlayClick = true,
	closeOnEsc = true,
	footer,
	className = ''
}: ModalProps) => {
	// Handle ESC key
	useEffect(() => {
		if (!isOpen || !closeOnEsc) return

		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		document.addEventListener('keydown', handleEsc)
		return () => document.removeEventListener('keydown', handleEsc)
	}, [isOpen, closeOnEsc, onClose])

	// Disable body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'auto'
		}

		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [isOpen])

	if (!isOpen) return null

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (closeOnOverlayClick && e.target === e.currentTarget) {
			onClose()
		}
	}

	const classes = [
		'ui-modal',
		`ui-modal--${size}`,
		className
	].filter(Boolean).join(' ')

	return (
		<div className="ui-modal-overlay" onClick={handleOverlayClick}>
			<div className={classes} onClick={(e) => e.stopPropagation()}>
				{/* Header */}
				{(title || showCloseButton) && (
					<div className="ui-modal__header">
						{title && <h2 className="ui-modal__title">{title}</h2>}
						{showCloseButton && (
							<button
								className="ui-modal__close"
								onClick={onClose}
								aria-label="Close modal"
							>
								<X className="ui-modal__close-icon" />
							</button>
						)}
					</div>
				)}

				{/* Content */}
				<div className="ui-modal__content">
					{children}
				</div>

				{/* Footer */}
				{footer && (
					<div className="ui-modal__footer">
						{footer}
					</div>
				)}
			</div>
		</div>
	)
}

export default Modal

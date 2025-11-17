import { type ReactNode } from 'react'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import './Alert.css'

export interface AlertProps {
	children: ReactNode
	variant?: 'info' | 'success' | 'warning' | 'error'
	title?: string
	closable?: boolean
	onClose?: () => void
	icon?: ReactNode
	className?: string
}

const variantIcons = {
	info: Info,
	success: CheckCircle,
	warning: AlertTriangle,
	error: AlertCircle
}

export const Alert = ({
	children,
	variant = 'info',
	title,
	closable = false,
	onClose,
	icon,
	className = ''
}: AlertProps) => {
	const Icon = icon ? null : variantIcons[variant]

	const classes = [
		'ui-alert',
		`ui-alert--${variant}`,
		className
	].filter(Boolean).join(' ')

	return (
		<div className={classes} role="alert">
			{/* Icon */}
			<div className="ui-alert__icon">
				{icon || (Icon && <Icon className="ui-alert__icon-svg" />)}
			</div>

			{/* Content */}
			<div className="ui-alert__content">
				{title && (
					<div className="ui-alert__title">{title}</div>
				)}
				<div className="ui-alert__message">{children}</div>
			</div>

			{/* Close Button */}
			{closable && (
				<button
					className="ui-alert__close"
					onClick={onClose}
					aria-label="Close alert"
				>
					<X className="ui-alert__close-icon" />
				</button>
			)}
		</div>
	)
}

export default Alert

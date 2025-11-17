import { type ReactNode } from 'react'
import './Badge.css'

export interface BadgeProps {
	children: ReactNode
	variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
	size?: 'small' | 'medium' | 'large'
	className?: string
}

export const Badge = ({
	children,
	variant = 'default',
	size = 'medium',
	className = ''
}: BadgeProps) => {
	const classes = [
		'ui-badge',
		`ui-badge--${variant}`,
		`ui-badge--${size}`,
		className
	].filter(Boolean).join(' ')

	return (
		<span className={classes}>
			{children}
		</span>
	)
}

export default Badge

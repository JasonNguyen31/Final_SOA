import { type ReactNode, type ButtonHTMLAttributes } from 'react'
import './Button.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
	size?: 'small' | 'medium' | 'large'
	fullWidth?: boolean
	icon?: ReactNode
	iconPosition?: 'left' | 'right'
	loading?: boolean
	children: ReactNode
}

export const Button = ({
	variant = 'primary',
	size = 'medium',
	fullWidth = false,
	icon,
	iconPosition = 'left',
	loading = false,
	disabled,
	className = '',
	children,
	...props
}: ButtonProps) => {
	const classes = [
		'ui-button',
		`ui-button--${variant}`,
		`ui-button--${size}`,
		fullWidth && 'ui-button--full-width',
		loading && 'ui-button--loading',
		disabled && 'ui-button--disabled',
		className
	].filter(Boolean).join(' ')

	return (
		<button
			className={classes}
			disabled={disabled || loading}
			{...props}
		>
			{loading && <span className="ui-button__spinner" />}
			{!loading && icon && iconPosition === 'left' && (
				<span className="ui-button__icon ui-button__icon--left">{icon}</span>
			)}
			<span className="ui-button__content">{children}</span>
			{!loading && icon && iconPosition === 'right' && (
				<span className="ui-button__icon ui-button__icon--right">{icon}</span>
			)}
		</button>
	)
}

export default Button

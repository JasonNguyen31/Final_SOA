import { type ReactNode } from 'react'
import './Card.css'

export interface CardProps {
	children: ReactNode
	variant?: 'default' | 'outlined' | 'elevated' | 'glass'
	padding?: 'none' | 'small' | 'medium' | 'large'
	hover?: boolean
	onClick?: () => void
	className?: string
}

export const Card = ({
	children,
	variant = 'default',
	padding = 'medium',
	hover = false,
	onClick,
	className = ''
}: CardProps) => {
	const classes = [
		'ui-card',
		`ui-card--${variant}`,
		`ui-card--padding-${padding}`,
		hover && 'ui-card--hover',
		onClick && 'ui-card--clickable',
		className
	].filter(Boolean).join(' ')

	return (
		<div className={classes} onClick={onClick}>
			{children}
		</div>
	)
}

export const CardHeader = ({
	children,
	className = ''
}: {
	children: ReactNode
	className?: string
}) => {
	return (
		<div className={`ui-card__header ${className}`}>
			{children}
		</div>
	)
}

export const CardTitle = ({
	children,
	className = ''
}: {
	children: ReactNode
	className?: string
}) => {
	return (
		<h3 className={`ui-card__title ${className}`}>
			{children}
		</h3>
	)
}

export const CardContent = ({
	children,
	className = ''
}: {
	children: ReactNode
	className?: string
}) => {
	return (
		<div className={`ui-card__content ${className}`}>
			{children}
		</div>
	)
}

export const CardFooter = ({
	children,
	className = ''
}: {
	children: ReactNode
	className?: string
}) => {
	return (
		<div className={`ui-card__footer ${className}`}>
			{children}
		</div>
	)
}

export default Card

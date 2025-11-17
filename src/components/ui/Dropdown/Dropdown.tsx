import { type ReactNode, useState, useEffect, useRef } from 'react'
import './Dropdown.css'

export interface DropdownProps {
	trigger: ReactNode
	children: ReactNode
	align?: 'left' | 'right' | 'center'
	className?: string
	onOpenChange?: (open: boolean) => void
}

export const Dropdown = ({
	trigger,
	children,
	align = 'left',
	className = '',
	onOpenChange
}: DropdownProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [clickLocked, setClickLocked] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const handleToggle = () => {
		const newState = !isOpen
		setIsOpen(newState)
		setClickLocked(newState)
		onOpenChange?.(newState)
	}

	const handleMouseEnter = () => {
		if (!clickLocked) {
			setIsOpen(true)
			onOpenChange?.(true)
		}
	}

	const handleMouseLeave = () => {
		if (!clickLocked) {
			setIsOpen(false)
			onOpenChange?.(false)
		}
	}

	// Handle clicks outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				if (clickLocked) {
					setIsOpen(false)
					setClickLocked(false)
					onOpenChange?.(false)
				}
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [clickLocked, onOpenChange])

	const classes = [
		'ui-dropdown',
		`ui-dropdown--${align}`,
		isOpen && 'ui-dropdown--open',
		className
	].filter(Boolean).join(' ')

	return (
		<div
			ref={dropdownRef}
			className={classes}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<div className="ui-dropdown__trigger" onClick={handleToggle}>
				{trigger}
			</div>
			{isOpen && (
				<div className="ui-dropdown__content">
					{children}
				</div>
			)}
		</div>
	)
}

export const DropdownItem = ({
	children,
	onClick,
	href,
	className = ''
}: {
	children: ReactNode
	onClick?: () => void
	href?: string
	className?: string
}) => {
	const classes = ['ui-dropdown__item', className].filter(Boolean).join(' ')

	if (href) {
		return (
			<a href={href} className={classes} onClick={onClick}>
				{children}
			</a>
		)
	}

	return (
		<button className={classes} onClick={onClick}>
			{children}
		</button>
	)
}

export const DropdownDivider = () => {
	return <div className="ui-dropdown__divider" />
}

export default Dropdown

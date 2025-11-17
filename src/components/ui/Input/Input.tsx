import { type ReactNode, type InputHTMLAttributes, forwardRef } from 'react'
import './Input.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
	helperText?: string
	leftIcon?: ReactNode
	rightIcon?: ReactNode
	fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			error,
			helperText,
			leftIcon,
			rightIcon,
			fullWidth = false,
			className = '',
			disabled,
			...props
		},
		ref
	) => {
		const wrapperClasses = [
			'ui-input-wrapper',
			fullWidth && 'ui-input-wrapper--full-width',
			error && 'ui-input-wrapper--error',
			disabled && 'ui-input-wrapper--disabled'
		].filter(Boolean).join(' ')

		const inputClasses = [
			'ui-input',
			leftIcon && 'ui-input--with-left-icon',
			rightIcon && 'ui-input--with-right-icon',
			className
		].filter(Boolean).join(' ')

		return (
			<div className={wrapperClasses}>
				{label && (
					<label className="ui-input-label">
						{label}
					</label>
				)}
				<div className="ui-input-container">
					{leftIcon && (
						<span className="ui-input-icon ui-input-icon--left">
							{leftIcon}
						</span>
					)}
					<input
						ref={ref}
						className={inputClasses}
						disabled={disabled}
						{...props}
					/>
					{rightIcon && (
						<span className="ui-input-icon ui-input-icon--right">
							{rightIcon}
						</span>
					)}
				</div>
				{error && (
					<span className="ui-input-error">{error}</span>
				)}
				{helperText && !error && (
					<span className="ui-input-helper">{helperText}</span>
				)}
			</div>
		)
	}
)

Input.displayName = 'Input'

export default Input

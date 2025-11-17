import './Spinner.css'

export interface SpinnerProps {
	size?: 'small' | 'medium' | 'large'
	color?: 'primary' | 'white' | 'inherit'
	className?: string
}

export const Spinner = ({
	size = 'medium',
	color = 'primary',
	className = ''
}: SpinnerProps) => {
	const classes = [
		'ui-spinner',
		`ui-spinner--${size}`,
		`ui-spinner--${color}`,
		className
	].filter(Boolean).join(' ')

	return (
		<div className={classes}>
			<div className="ui-spinner__circle" />
		</div>
	)
}

export default Spinner

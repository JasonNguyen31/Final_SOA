import { type ReactNode } from 'react'
import './Avatar.css'

export interface AvatarProps {
	src?: string
	alt?: string
	size?: 'small' | 'medium' | 'large'
	status?: 'online' | 'offline' | 'away' | 'busy'
	fallback?: ReactNode
	className?: string
}

export const Avatar = ({
	src,
	alt = 'Avatar',
	size = 'medium',
	status,
	fallback,
	className = ''
}: AvatarProps) => {
	const classes = [
		'ui-avatar',
		`ui-avatar--${size}`,
		status && 'ui-avatar--with-status',
		className
	].filter(Boolean).join(' ')

	return (
		<div className={classes}>
			{src ? (
				<img src={src} alt={alt} className="ui-avatar__image" />
			) : (
				<div className="ui-avatar__fallback">
					{fallback || alt.charAt(0).toUpperCase()}
				</div>
			)}
			{status && (
				<span className={`ui-avatar__status ui-avatar__status--${status}`} />
			)}
		</div>
	)
}

export default Avatar

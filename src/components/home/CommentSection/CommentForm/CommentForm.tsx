import { useState } from 'react'
import { Send } from 'lucide-react'
import { Avatar, Button } from '@/shared/components/ui'
import './CommentForm.css'

export interface CommentFormProps {
	currentUserAvatar?: string
	currentUserName?: string
	onSubmit: (text: string) => void | Promise<void>
	placeholder?: string
	buttonText?: string
	loading?: boolean
	onFocusRequireAuth?: () => void
	isAuthenticated?: boolean
}

export const CommentForm = ({
	currentUserAvatar,
	currentUserName = 'User',
	onSubmit,
	placeholder = 'Add a comment...',
	buttonText = 'Comment',
	loading = false,
	onFocusRequireAuth,
	isAuthenticated = true
}: CommentFormProps) => {
	const [commentText, setCommentText] = useState('')
	const [isFocused, setIsFocused] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!commentText.trim()) return

		await onSubmit(commentText)
		setCommentText('')
		setIsFocused(false)
	}

	const handleCancel = () => {
		setCommentText('')
		setIsFocused(false)
	}

	const handleFocus = () => {
		if (!isAuthenticated && onFocusRequireAuth) {
			onFocusRequireAuth()
			return
		}
		setIsFocused(true)
	}

	const hasText = commentText.trim().length > 0

	return (
		<form className="comment-form" onSubmit={handleSubmit}>
			<Avatar
				src={currentUserAvatar}
				alt={currentUserName}
				size="medium"
				fallback={currentUserName.charAt(0).toUpperCase()}
				className="comment-form__avatar"
			/>

			<div className="comment-form__input-wrapper">
				<textarea
					className="comment-form__textarea"
					placeholder={placeholder}
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
					onFocus={handleFocus}
					rows={isFocused ? 3 : 1}
					disabled={loading}
				/>

				{(isFocused || hasText) && (
					<div className="comment-form__actions">
						<Button
							type="button"
							variant="ghost"
							size="small"
							onClick={handleCancel}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="primary"
							size="small"
							icon={<Send />}
							iconPosition="right"
							disabled={!hasText}
							loading={loading}
						>
							{buttonText}
						</Button>
					</div>
				)}
			</div>
		</form>
	)
}

export default CommentForm

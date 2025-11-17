import { CommentItem, type Comment } from '../CommentItem/CommentItem'
import { Spinner, Alert } from '@/shared/components/ui'
import './CommentList.css'

export interface CommentListProps {
	comments: Comment[]
	currentUserId?: string
	loading?: boolean
	error?: string | null
	onLike?: (commentId: string) => void
	onReply?: (commentId: string) => void
	onDelete?: (commentId: string) => void
}

export const CommentList = ({
	comments,
	currentUserId,
	loading = false,
	error = null,
	onLike,
	onReply,
	onDelete
}: CommentListProps) => {
	// Loading state
	if (loading) {
		return (
			<div className="comment-list comment-list--loading">
				<Spinner size="large" color="primary" />
				<p className="comment-list__loading-text">Loading comments...</p>
			</div>
		)
	}

	// Error state
	if (error) {
		return (
			<div className="comment-list comment-list--error">
				<Alert variant="error" closable>
					{error}
				</Alert>
			</div>
		)
	}

	// Empty state
	if (comments.length === 0) {
		return (
			<div className="comment-list comment-list--empty">
				<p className="comment-list__empty-text">
					No comments yet. Be the first to comment!
				</p>
			</div>
		)
	}

	// Comments list
	return (
		<div className="comment-list">
			{comments.map((comment) => (
				<CommentItem
					key={comment.id}
					comment={comment}
					currentUserId={currentUserId}
					onLike={onLike}
					onReply={onReply}
					onDelete={onDelete}
				/>
			))}
		</div>
	)
}

export default CommentList

import { useState } from 'react'
import { ThumbsUp, MessageCircle, Trash2 } from 'lucide-react'
import { Avatar, Button } from '@/shared/components/ui'
import './CommentItem.css'

export interface Comment {
	id: string
	author: string
	authorAvatar?: string
	content: string
	timestamp: string
	likes: number
	hasLiked: boolean
	userId?: string
}

export interface CommentItemProps {
	comment: Comment
	currentUserId?: string
	onLike?: (commentId: string) => void
	onReply?: (commentId: string) => void
	onDelete?: (commentId: string) => void
}

export const CommentItem = ({
	comment,
	currentUserId,
	onLike,
	onReply,
	onDelete
}: CommentItemProps) => {
	const [isLiked, setIsLiked] = useState(comment.hasLiked)
	const [likeCount, setLikeCount] = useState(comment.likes)

	const handleLike = () => {
		const newLikedState = !isLiked
		setIsLiked(newLikedState)
		setLikeCount(prev => newLikedState ? prev + 1 : prev - 1)
		onLike?.(comment.id)
	}

	const handleReply = () => {
		onReply?.(comment.id)
	}

	const handleDelete = () => {
		onDelete?.(comment.id)
	}

	const isOwnComment = currentUserId && comment.userId === currentUserId

	return (
		<div className="comment-item">
			{/* Avatar */}
			<Avatar
				src={comment.authorAvatar}
				alt={comment.author}
				size="medium"
				fallback={comment.author.charAt(0).toUpperCase()}
				className="comment-item__avatar"
			/>

			{/* Content */}
			<div className="comment-item__content">
				{/* Author Info */}
				<div className="comment-item__header">
					<div className="comment-item__author-info">
						<span className="comment-item__author">{comment.author}</span>
						<span className="comment-item__timestamp">{comment.timestamp}</span>
					</div>
					{isOwnComment && (
						<button
							className="comment-item__delete-btn"
							onClick={handleDelete}
							aria-label="Delete comment"
							title="Delete comment"
						>
							<Trash2 className="comment-item__delete-icon" />
						</button>
					)}
				</div>

				{/* Comment Text */}
				<p className="comment-item__text">{comment.content}</p>

				{/* Actions */}
				<div className="comment-item__actions">
					<Button
						variant="ghost"
						size="small"
						icon={<ThumbsUp />}
						iconPosition="left"
						onClick={handleLike}
						className={`comment-item__action ${isLiked ? 'comment-item__action--liked' : ''}`}
					>
						{likeCount > 0 ? likeCount : 'Like'}
					</Button>
					<Button
						variant="ghost"
						size="small"
						icon={<MessageCircle />}
						iconPosition="left"
						onClick={handleReply}
						className="comment-item__action"
					>
						Reply
					</Button>
				</div>
			</div>
		</div>
	)
}

export default CommentItem

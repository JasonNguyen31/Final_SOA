import { useState } from 'react'
import { Card, Badge } from '@/shared/components/ui'
import { CommentForm } from './CommentForm/CommentForm'
import { CommentList } from './CommentList/CommentList'
import type { Comment } from './CommentItem/CommentItem'
import { useComments } from '@/hooks/useComments'
import { useAuthModal } from '@/context/AuthModalContext'
import './CommentSection.css'

export interface CommentSectionProps {
	contentType: 'movie' | 'book'
	contentId: string
	currentUserId?: string
	currentUserName?: string
	currentUserAvatar?: string
}

export const CommentSection = ({
	contentType,
	contentId,
	currentUserId,
	currentUserName = 'User',
	currentUserAvatar
}: CommentSectionProps) => {
	const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
	const { openLogin } = useAuthModal()

	// Use the comments hook to integrate with the service layer
	const { comments, loading, error, addComment, deleteComment } = useComments(
		contentType,
		contentId
	)

	// Transform API comments to match our component interface
	const transformedComments: Comment[] = comments.map((comment) => ({
		id: comment.id,
		author: comment.userDetails?.displayName || 'Anonymous',
		authorAvatar: comment.userDetails?.avatar,
		content: comment.text,
		timestamp: formatTimestamp(comment.createdAt),
		likes: 0, // TODO: Implement likes when available from API
		hasLiked: false,
		userId: comment.userId
	}))

	// Sort comments
	const sortedComments = [...transformedComments].sort((a, b) => {
		if (sortBy === 'newest') {
			return b.id.localeCompare(a.id)
		} else {
			return a.id.localeCompare(b.id)
		}
	})

	// Handle new comment submission
	const handleSubmitComment = async (text: string) => {
		// Check if user is logged in
		if (!currentUserId) {
			openLogin()
			return
		}

		try {
			await addComment(text)
		} catch (err: any) {
			console.error('Failed to add comment:', err)
			// Show user-friendly error message
			let errorMessage = 'Failed to post comment. Please try again.'

			// Handle different error types
			if (typeof err === 'string') {
				errorMessage = err
			} else if (err instanceof Error) {
				errorMessage = err.message
			} else if (err?.response?.status === 401) {
				errorMessage = 'Please log in again to post comments.'
			}

			alert(errorMessage)
		}
	}

	// Handle comment like (placeholder until API supports it)
	const handleLikeComment = (commentId: string) => {
		console.log('Like comment:', commentId)
		// TODO: Implement when API supports likes
	}

	// Handle comment reply (placeholder)
	const handleReplyComment = (commentId: string) => {
		console.log('Reply to comment:', commentId)
		// TODO: Implement reply functionality
	}

	// Handle comment delete
	const handleDeleteComment = async (commentId: string) => {
		try {
			await deleteComment(commentId)
		} catch (err) {
			console.error('Failed to delete comment:', err)
		}
	}

	return (
		<Card variant="elevated" padding="none" className="comment-section">
			{/* Header */}
			<div className="comment-section__header">
				<div className="comment-section__title-wrapper">
					<h2 className="comment-section__title">Comments</h2>
					<Badge variant="primary" size="medium">
						{transformedComments.length}
					</Badge>
				</div>
				<div className="comment-section__sort">
					<span className="comment-section__sort-label">Sort By</span>
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
						className="comment-section__sort-select"
					>
						<option value="newest">Newest</option>
						<option value="oldest">Oldest</option>
					</select>
				</div>
			</div>

			{/* Comment Form */}
			<div className="comment-section__form">
				<CommentForm
					currentUserAvatar={currentUserAvatar}
					currentUserName={currentUserName}
					onSubmit={handleSubmitComment}
					placeholder="Add a comment..."
					buttonText="Comment"
					isAuthenticated={!!currentUserId}
					onFocusRequireAuth={openLogin}
				/>
			</div>

			{/* Comments List */}
			<div className="comment-section__list">
				<CommentList
					comments={sortedComments}
					currentUserId={currentUserId}
					loading={loading}
					error={error}
					onLike={handleLikeComment}
					onReply={handleReplyComment}
					onDelete={handleDeleteComment}
				/>
			</div>
		</Card>
	)
}

// Helper function to format timestamp
function formatTimestamp(dateString: string): string {
	const date = new Date(dateString)
	const now = new Date()
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

	if (diffInSeconds < 60) {
		return 'just now'
	} else if (diffInSeconds < 3600) {
		const minutes = Math.floor(diffInSeconds / 60)
		return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
	} else if (diffInSeconds < 86400) {
		const hours = Math.floor(diffInSeconds / 3600)
		return `${hours} hour${hours > 1 ? 's' : ''} ago`
	} else if (diffInSeconds < 2592000) {
		const days = Math.floor(diffInSeconds / 86400)
		return `${days} day${days > 1 ? 's' : ''} ago`
	} else {
		const months = Math.floor(diffInSeconds / 2592000)
		return `${months} month${months > 1 ? 's' : ''} ago`
	}
}

export default CommentSection

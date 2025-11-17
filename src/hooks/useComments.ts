import { useState, useEffect, useCallback } from 'react'
import { commentService, type Comment } from '@/services/interaction/commentService'
import { getUserFriendlyErrorMessage } from '@/core/api/utils/errors'

export const useComments = (contentType: 'movie' | 'book', contentId: string) => {
	const [comments, setComments] = useState<Comment[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchComments = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			const data = await commentService.getComments(contentType, contentId)
			setComments(data)
		} catch (err) {
			const message = getUserFriendlyErrorMessage(err)
			setError(message)
		} finally {
			setLoading(false)
		}
	}, [contentType, contentId])

	useEffect(() => {
		fetchComments()
	}, [fetchComments])

	const addComment = useCallback(async (text: string) => {
		try {
			const newComment = await commentService.createComment({
				contentType,
				contentId,
				text
			})
			setComments(prev => [newComment, ...prev])
			return newComment
		} catch (err) {
			const message = getUserFriendlyErrorMessage(err)
			console.log('Error message type:', typeof message, 'Value:', message)
			// Ensure message is a string
			const errorMessage = typeof message === 'string' ? message : JSON.stringify(message)
			throw new Error(errorMessage)
		}
	}, [contentType, contentId])

	const deleteComment = useCallback(async (commentId: string) => {
		try {
			await commentService.deleteComment(commentId)
			setComments(prev => prev.filter(c => c.id !== commentId))
		} catch (err) {
			const message = getUserFriendlyErrorMessage(err)
			throw new Error(message)
		}
	}, [])

	return {
		comments,
		loading,
		error,
		addComment,
		deleteComment,
		refetch: fetchComments
	}
}

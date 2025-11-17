import axios from 'axios'
import BACKEND_CONFIG from '@/config/backend.config'

export interface Comment {
	id: string
	userId: string
	userDetails: {
		displayName: string
		avatar: string
	}
	contentType: 'movie' | 'book'
	contentId: string
	text: string
	status: 'approved' | 'rejected'
	createdAt: string
}

export interface CreateCommentData {
	contentType: 'movie' | 'book'
	contentId: string
	text: string
}

class CommentService {
	private baseUrl = BACKEND_CONFIG.MOVIE_SERVICE.BASE_URL

	// Get auth token from storage
	private getAuthToken(): string | null {
		return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
	}

	// Create axios config with auth token
	private getConfig() {
		const token = this.getAuthToken()
		return {
			headers: token ? { Authorization: `Bearer ${token}` } : {}
		}
	}

	async getComments(contentType: 'movie' | 'book', contentId: string): Promise<Comment[]> {
		const response = await axios.get<{ success: boolean; data: Comment[] }>(
			`${this.baseUrl}${BACKEND_CONFIG.MOVIE_SERVICE.ENDPOINTS.COMMENTS}`,
			{
				params: { contentType, contentId }
			}
		)
		return response.data.data
	}

	async createComment(data: CreateCommentData): Promise<Comment> {
		const token = this.getAuthToken()
		console.log('Token exists:', !!token, 'Token preview:', token?.substring(0, 20) + '...')

		const response = await axios.post<{ success: boolean; data: Comment }>(
			`${this.baseUrl}${BACKEND_CONFIG.MOVIE_SERVICE.ENDPOINTS.COMMENTS}`,
			data,
			this.getConfig()
		)
		return response.data.data
	}

	async deleteComment(commentId: string): Promise<void> {
		await axios.delete(
			`${this.baseUrl}${BACKEND_CONFIG.MOVIE_SERVICE.ENDPOINTS.DELETE_COMMENT(commentId)}`,
			this.getConfig()
		)
	}

	async reportComment(commentId: string, reason: string): Promise<void> {
		await axios.post(
			`${this.baseUrl}${BACKEND_CONFIG.MOVIE_SERVICE.ENDPOINTS.REPORT_COMMENT(commentId)}`,
			{ reason },
			this.getConfig()
		)
	}
}

export const commentService = new CommentService()

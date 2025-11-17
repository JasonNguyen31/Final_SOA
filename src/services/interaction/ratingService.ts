import { apiClient } from '@/core/api/client/apiClient'

export interface Rating {
	id: string
	userId: string
	contentType: 'movie' | 'book'
	contentId: string
	rating: number
	createdAt: string
}

export interface CreateRatingData {
	contentType: 'movie' | 'book'
	contentId: string
	rating: number
}

class RatingService {
	private baseUrl = '/ratings'

	async getRating(contentType: 'movie' | 'book', contentId: string): Promise<Rating | null> {
		return apiClient.get<Rating | null>(this.baseUrl, {
			params: { contentType, contentId }
		})
	}

	async createOrUpdateRating(data: CreateRatingData): Promise<Rating> {
		return apiClient.post<Rating>(this.baseUrl, data)
	}

	async deleteRating(ratingId: string): Promise<void> {
		await apiClient.delete(`${this.baseUrl}/${ratingId}`)
	}
}

export const ratingService = new RatingService()

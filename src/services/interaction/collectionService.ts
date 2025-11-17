/**
 * Collection Service
 * Handles all collection-related API calls
 */

import axios from 'axios'
import { tokenService } from '@/services/auth/tokenService'
import { BACKEND_CONFIG } from '@/config/backend.config'
import type {
	Collection,
	CreateCollectionDto,
	UpdateCollectionDto,
	AddToCollectionDto,
	CollectionResponse,
	PublicCollectionWithOwner,
} from '@/types/collection.types'

// Collection service base URL
const COLLECTION_API_BASE = BACKEND_CONFIG.COLLECTION_SERVICE.BASE_URL

// Helper function to get auth headers
const getAuthHeaders = () => {
	const token = tokenService.getAccessToken()
	return {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	}
}

export const collectionService = {
	/**
	 * Get all collections for the current user
	 */
	getUserCollections: async (): Promise<Collection[]> => {
		try {
			const response = await axios.get<{success: boolean, data: {collections: Collection[]}}>(
				`${COLLECTION_API_BASE}${BACKEND_CONFIG.COLLECTION_SERVICE.ENDPOINTS.LIST}`,
				getAuthHeaders()
			)
			return response.data.data.collections || []
		} catch (error) {
			console.error('Failed to fetch collections:', error)
			throw error
		}
	},

	/**
	 * Get a single collection by ID
	 */
	getCollectionById: async (collectionId: string): Promise<Collection> => {
		try {
			const response = await axios.get<{success: boolean, data: Collection}>(
				`${COLLECTION_API_BASE}${BACKEND_CONFIG.COLLECTION_SERVICE.ENDPOINTS.GET(collectionId)}`,
				getAuthHeaders()
			)
			return response.data.data
		} catch (error) {
			console.error('Failed to fetch collection:', error)
			throw error
		}
	},

	/**
	 * Create a new collection
	 */
	createCollection: async (data: CreateCollectionDto): Promise<Collection> => {
		try {
			const response = await axios.post<{success: boolean, data: Collection}>(
				`${COLLECTION_API_BASE}${BACKEND_CONFIG.COLLECTION_SERVICE.ENDPOINTS.CREATE}`,
				data,
				getAuthHeaders()
			)
			return response.data.data
		} catch (error) {
			console.error('Failed to create collection:', error)
			throw error
		}
	},

	/**
	 * Update an existing collection
	 */
	updateCollection: async (
		collectionId: string,
		data: UpdateCollectionDto
	): Promise<Collection> => {
		try {
			const response = await axios.put<{success: boolean, data: Collection}>(
				`${COLLECTION_API_BASE}${BACKEND_CONFIG.COLLECTION_SERVICE.ENDPOINTS.UPDATE(collectionId)}`,
				data,
				getAuthHeaders()
			)
			return response.data.data
		} catch (error) {
			console.error('Failed to update collection:', error)
			throw error
		}
	},

	/**
	 * Delete a collection
	 */
	deleteCollection: async (collectionId: string): Promise<void> => {
		try {
			await axios.delete(
				`${COLLECTION_API_BASE}${BACKEND_CONFIG.COLLECTION_SERVICE.ENDPOINTS.DELETE(collectionId)}`,
				getAuthHeaders()
			)
		} catch (error) {
			console.error('Failed to delete collection:', error)
			throw error
		}
	},

	/**
	 * Add an item to a collection
	 */
	addItemToCollection: async (
		collectionId: string,
		item: AddToCollectionDto
	): Promise<Collection> => {
		try {
			const response = await axios.post<{success: boolean, data: Collection}>(
				`${COLLECTION_API_BASE}${BACKEND_CONFIG.COLLECTION_SERVICE.ENDPOINTS.ADD_ITEM(collectionId)}`,
				item,
				getAuthHeaders()
			)
			return response.data.data
		} catch (error) {
			console.error('Failed to add item to collection:', error)
			throw error
		}
	},

	/**
	 * Remove an item from a collection
	 */
	removeItemFromCollection: async (
		collectionId: string,
		contentId: string
	): Promise<Collection> => {
		try {
			const response = await axios.delete<{success: boolean, data: Collection}>(
				`${COLLECTION_API_BASE}${BACKEND_CONFIG.COLLECTION_SERVICE.ENDPOINTS.REMOVE_ITEM(collectionId, contentId)}`,
				getAuthHeaders()
			)
			return response.data.data
		} catch (error) {
			console.error('Failed to remove item from collection:', error)
			throw error
		}
	},

	/**
	 * Get public collections (for browsing)
	 */
	getPublicCollections: async (
		page: number = 1,
		limit: number = 20
	): Promise<{ collections: PublicCollectionWithOwner[]; total: number }> => {
		try {
			const response = await axios.get<{
				success: boolean
				data: {
					collections: PublicCollectionWithOwner[]
					total: number
				}
			}>(`${COLLECTION_API_BASE}${BACKEND_CONFIG.COLLECTION_SERVICE.ENDPOINTS.PUBLIC}`, {
				params: { page, limit },
				...getAuthHeaders(),
			})
			return response.data.data
		} catch (error) {
			console.error('Failed to fetch public collections:', error)
			throw error
		}
	},

	/**
	 * Search collections by name or description
	 */
	searchCollections: async (query: string): Promise<Collection[]> => {
		try {
			const response = await axios.get<{success: boolean, data: {collections: Collection[]}}>(
				`${COLLECTION_API_BASE}${BACKEND_CONFIG.COLLECTION_SERVICE.ENDPOINTS.SEARCH}`,
				{
					params: { q: query },
					...getAuthHeaders(),
				}
			)
			return response.data.data.collections || []
		} catch (error) {
			console.error('Failed to search collections:', error)
			throw error
		}
	},
}

export default collectionService

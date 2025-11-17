/**
 * Collection Types
 * Types for user collections feature
 */

export type CollectionPrivacy = 'public' | 'private'

export type CollectionItemType = 'movie' | 'book'

export interface CollectionItem {
	contentId: string
	contentType: CollectionItemType
	title: string
	thumbnail?: string
	addedAt: string
}

export interface Collection {
	_id: string
	userId: string
	name: string
	description?: string
	privacy: CollectionPrivacy
	items: CollectionItem[]
	itemCount: number
	createdAt: string
	updatedAt: string
}

export interface CreateCollectionDto {
	name: string
	description?: string
	privacy?: CollectionPrivacy
}

export interface UpdateCollectionDto {
	name?: string
	description?: string
	privacy?: CollectionPrivacy
}

export interface AddToCollectionDto {
	contentId: string
	contentType: CollectionItemType
	title: string
	thumbnail?: string
}

export interface CollectionResponse {
	collections: Collection[]
	total: number
}

export interface PublicCollectionWithOwner extends Collection {
	owner: {
		_id: string
		username: string
		avatar?: string
	}
}

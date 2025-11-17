/**
 * Content Types
 * Type definitions for content-related data
 */

export interface ContentCard {
	id: string
	title: string
	subtitle?: string
	image: string
	rating: number
	reviews: number
	episodes: number
	watching: number
	type: string
	season: string
	isSpecial?: boolean
	hasCheckmark?: boolean
	isPremium?: boolean
}

export interface SidebarItem {
	id: string
	title: string
	subtitle: string
	image: string
	views: string
}

export interface VideoItem {
	id: string
	title: string
	thumbnail: string
	views: string
	comments: number
	date: string
	duration: string
}

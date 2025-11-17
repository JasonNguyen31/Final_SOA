import { apiClient } from '@/core/api/client/apiClient'

export interface Book {
	id: string
	title: string
	author: string
	description?: string
	coverImageUrl: string
	pdfUrl?: string
	categories: string[]
	publishYear?: number
	publisher?: string
	totalPages: number
	rating: number
	totalRatings: number
	totalReads: number
}

export interface BookQueryParams {
	page?: number
	limit?: number
	category?: string
	search?: string
	author?: string
}

export interface PaginatedBooks {
	data: Book[]
	pagination: {
		currentPage: number
		totalPages: number
		totalItems: number
		itemsPerPage: number
	}
}

export interface ReadProgress {
	bookId: string
	currentPage: number
	totalPages: number
	percentage: number
	isCompleted: boolean
	lastReadAt: string
}

class BookService {
	private baseUrl = '/books'

	async getBooks(params?: BookQueryParams): Promise<PaginatedBooks> {
		return apiClient.get<PaginatedBooks>(this.baseUrl, { params })
	}

	async getBookById(id: string): Promise<Book> {
		return apiClient.get<Book>(`${this.baseUrl}/${id}`)
	}

	async searchBooks(query: string, params?: BookQueryParams): Promise<PaginatedBooks> {
		return apiClient.get<PaginatedBooks>(`${this.baseUrl}/search`, {
			params: { q: query, ...params }
		})
	}

	async getReadProgress(bookId: string): Promise<ReadProgress | null> {
		return apiClient.get<ReadProgress | null>(`${this.baseUrl}/${bookId}/progress`)
	}

	async updateReadProgress(
		bookId: string,
		progress: { currentPage: number; totalPages: number }
	): Promise<ReadProgress> {
		return apiClient.put<ReadProgress>(`${this.baseUrl}/${bookId}/progress`, progress)
	}

	async getReadHistory(): Promise<ReadProgress[]> {
		return apiClient.get<ReadProgress[]>(`${this.baseUrl}/read-history`)
	}

	async getContinueReading(): Promise<Book[]> {
		return apiClient.get<Book[]>(`${this.baseUrl}/continue-reading`)
	}
}

export const bookService = new BookService()

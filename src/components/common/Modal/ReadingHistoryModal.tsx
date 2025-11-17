import { createPortal } from 'react-dom'
import { X, BookOpen, Book, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { bookService } from '../../../services/content/bookService'
import type { ReadProgress } from '../../../services/content/bookService'
import './ReadingHistoryModal.css'

interface ReadingHistoryModalProps {
	isOpen: boolean
	onClose: () => void
}

// Extended ReadProgress with book information
interface ReadProgressWithBook extends ReadProgress {
	title?: string
	image?: string
	thumbnailUrl?: string
	type?: 'Manga' | 'Light Novel' | 'Book'
	currentChapter?: number
	totalChapters?: number
}

export const ReadingHistoryModal = ({ isOpen, onClose }: ReadingHistoryModalProps) => {
	const [readingHistory, setReadingHistory] = useState<ReadProgressWithBook[]>([])
	const [loading, setLoading] = useState(true)

	// Fetch reading history from API
	useEffect(() => {
		const fetchReadingHistory = async () => {
			if (!isOpen) return

			try {
				setLoading(true)
				const history = await bookService.getReadHistory()
				setReadingHistory(history)
			} catch (error) {
				console.error('Failed to fetch reading history:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchReadingHistory()
	}, [isOpen])

	if (!isOpen) return null

	const getProgress = (currentPage: number, totalPages: number): number => {
		if (!totalPages) return 0
		return Math.round((currentPage / totalPages) * 100)
	}

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString)
		const now = new Date()
		const diffInMs = now.getTime() - date.getTime()
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

		if (diffInHours < 1) {
			const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
			return `${diffInMinutes} minutes ago`
		}
		if (diffInHours < 24) {
			return `${diffInHours} hours ago`
		}
		const diffInDays = Math.floor(diffInHours / 24)
		if (diffInDays < 7) {
			return `${diffInDays} days ago`
		}
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
	}

	const handleContinueReading = (bookId: string, currentPage?: number) => {
		onClose()
		// Navigate to read page with page
		const url = currentPage ? `/read/${bookId}?page=${currentPage}` : `/read/${bookId}`
		window.location.href = url
	}

	const handleRemoveHistory = async (bookId: string) => {
		try {
			// Remove from local state immediately for better UX
			setReadingHistory(prev => prev.filter(item => item.bookId !== bookId))
			// TODO: Call API to remove from history when endpoint is available
			console.log('Remove history item:', bookId)
		} catch (error) {
			console.error('Failed to remove history item:', error)
			// Refresh the list on error
			const history = await bookService.getReadHistory()
			setReadingHistory(history)
		}
	}

	const getTypeColor = (type: string): string => {
		switch (type) {
			case 'Manga':
				return '#f97316'
			case 'Light Novel':
				return '#8b5cf6'
			default:
				return '#3b82f6'
		}
	}

	const modalContent = (
		<div className="modal-overlay" onClick={onClose}>
			<div className="reading-history-modal" onClick={(e) => e.stopPropagation()}>
				<button className="modal-close-btn" onClick={onClose}>
					<X size={24} />
				</button>

				<div className="reading-history-content">
					{/* Header */}
					<div className="reading-history-header">
						<div className="reading-icon-wrapper">
							<BookOpen size={40} className="reading-icon" />
						</div>
						<h2 className="reading-history-title">Reading History</h2>
						<p className="reading-history-subtitle">
							Continue reading from where you left off
						</p>
					</div>

					{/* History List */}
					<div className="reading-history-list">
						{loading ? (
							<div className="reading-loading">Loading...</div>
						) : readingHistory.length > 0 ? (
							readingHistory.map((item) => (
								<div key={item.bookId} className="reading-history-item">
									<div
										className="reading-item-image"
										onClick={() => handleContinueReading(item.bookId, item.currentPage)}
									>
										<img src={item.thumbnailUrl || item.image || '/placeholder.jpg'} alt={item.title || 'Book'} />
										<div className="reading-overlay">
											<BookOpen size={32} />
										</div>
										{item.type && (
											<div
												className="reading-type-badge"
												style={{ background: getTypeColor(item.type) }}
											>
												{item.type}
											</div>
										)}
									</div>

									<div className="reading-item-details">
										<div className="reading-item-header">
											<h3 className="reading-item-title">{item.title || 'Untitled Book'}</h3>
											<button
												className="reading-remove-btn"
												onClick={() => handleRemoveHistory(item.bookId)}
												title="Remove from history"
											>
												<Trash2 size={18} />
											</button>
										</div>

										{item.currentChapter && item.totalChapters ? (
											<div className="reading-item-chapter">
												Chapter {item.currentChapter} of {item.totalChapters}
												{item.currentPage && ` • Page ${item.currentPage}`}
											</div>
										) : (
											<div className="reading-item-chapter">
												Page {item.currentPage} of {item.totalPages}
											</div>
										)}

										<div className="reading-item-progress">
											<div className="reading-progress-bar">
												<div
													className="reading-progress-fill"
													style={{
														width: `${item.percentage || getProgress(item.currentPage, item.totalPages)}%`,
														background: item.type ? getTypeColor(item.type) : '#3b82f6'
													}}
												></div>
											</div>
											<div className="reading-progress-info">
												<span className="reading-progress-text">
													{item.totalPages - item.currentPage} pages left
												</span>
												<span
													className="reading-progress-percentage"
													style={{ color: item.type ? getTypeColor(item.type) : '#3b82f6' }}
												>
													{item.percentage || getProgress(item.currentPage, item.totalPages)}%
												</span>
											</div>
										</div>

										<div className="reading-item-footer">
											{item.lastReadAt && (
												<span className="reading-last-read">
													<BookOpen size={14} />
													{formatDate(item.lastReadAt)}
												</span>
											)}
											<button
												className="btn-continue-reading"
												style={{ background: item.type ? getTypeColor(item.type) : '#3b82f6' }}
												onClick={() => handleContinueReading(item.bookId, item.currentPage)}
											>
												<Book size={16} />
												Continue Reading
											</button>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="reading-empty">
								<BookOpen size={64} className="reading-empty-icon" />
								<h3 className="reading-empty-title">No reading history</h3>
								<p className="reading-empty-message">
									Start reading manga, books, or light novels to see your progress here
								</p>
							</div>
						)}
					</div>

					{/* Clear All Button */}
					{readingHistory.length > 0 && (
						<button className="btn-clear-reading-all">
							Clear All History
						</button>
					)}
				</div>
			</div>
		</div>
	)

	return createPortal(modalContent, document.body)
}

export default ReadingHistoryModal

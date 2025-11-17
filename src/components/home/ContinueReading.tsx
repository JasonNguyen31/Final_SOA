import { useState, useEffect } from 'react'
import { BookOpen, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { bookService, type Book } from '@/services/content/bookService'
import '../styles/ContinueReading.css'

interface BookWithProgress extends Book {
	progress?: number
	currentChapter?: number
	lastReadAt?: string
}

export const ContinueReading = () => {
	const navigate = useNavigate()
	const [books, setBooks] = useState<BookWithProgress[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		loadContinueReading()
	}, [])

	const loadContinueReading = async () => {
		setIsLoading(true)
		try {
			// Call API to get continue reading books
			const data = await bookService.getContinueReading()
			// Filter books with progress between 1% and 90%
			const filteredBooks = data.filter(
				(book: BookWithProgress) => book.progress && book.progress > 0 && book.progress < 90
			)
			setBooks(filteredBooks)
		} catch (error) {
			console.error('Failed to load continue reading:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleBookClick = (bookId: string, currentChapter?: number) => {
		const chapter = currentChapter || 1
		navigate(`/book/${bookId}/chapter/${chapter}`)
	}

	const formatProgress = (progress: number) => {
		return `${Math.round(progress)}%`
	}

	if (isLoading) {
		return (
			<section className="continue-reading-section">
				<div className="section-header">
					<Clock size={24} />
					<h2 className="section-title">Continue Reading</h2>
				</div>
				<div className="continue-reading-loading">
					<div className="loading-spinner"></div>
				</div>
			</section>
		)
	}

	if (books.length === 0) {
		return null // Don't show section if no books to continue
	}

	return (
		<section className="continue-reading-section">
			<div className="section-header">
				<Clock size={24} className="section-icon" />
				<h2 className="section-title">Continue Reading</h2>
			</div>

			<div className="continue-reading-grid">
				{books.map((book) => (
					<div
						key={book._id}
						className="continue-reading-card"
						onClick={() => handleBookClick(book._id, book.currentChapter)}
					>
						<div className="card-image-wrapper">
							<img
								src={book.coverImage || '/placeholder-book.jpg'}
								alt={book.title}
								className="card-image"
							/>
							<div className="card-overlay">
								<button className="read-button">
									<BookOpen size={32} />
								</button>
							</div>

							{/* Progress Bar */}
							<div className="progress-bar-container">
								<div
									className="progress-bar"
									style={{ width: formatProgress(book.progress || 0) }}
								></div>
							</div>
						</div>

						<div className="card-info">
							<h3 className="card-title">{book.title}</h3>
							<div className="card-meta">
								<span className="card-progress">{formatProgress(book.progress || 0)}</span>
								{book.currentChapter && (
									<>
										<span className="meta-separator">•</span>
										<span className="card-chapter">Chapter {book.currentChapter}</span>
									</>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

export default ContinueReading

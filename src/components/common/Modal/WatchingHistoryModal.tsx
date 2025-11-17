import { createPortal } from 'react-dom'
import { X, Clock, Play, Trash2, Film } from 'lucide-react'
import { useState, useEffect } from 'react'
import { movieService } from '../../../services/content/movieService'
import type { Movie } from '../../../services/content/movieService'
import './WatchingHistoryModal.css'

interface WatchingHistoryModalProps {
	isOpen: boolean
	onClose: () => void
}

// Extended Movie type with progress information
interface MovieWithProgress extends Omit<Movie, 'season'> {
	currentTime?: number
	lastWatchedAt?: string
	episode?: number
	season?: number | string
}

export const WatchingHistoryModal = ({ isOpen, onClose }: WatchingHistoryModalProps) => {
	const [watchingHistory, setWatchingHistory] = useState<MovieWithProgress[]>([])
	const [loading, setLoading] = useState(true)

	// Fetch watching history from API
	useEffect(() => {
		const fetchWatchingHistory = async () => {
			if (!isOpen) return

			try {
				setLoading(true)
				// Using getContinueWatching which returns movies with progress
				const movies = await movieService.getContinueWatching()
				setWatchingHistory(movies)
			} catch (error) {
				console.error('Failed to fetch watching history:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchWatchingHistory()
	}, [isOpen])

	if (!isOpen) return null

	const formatTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		if (hours > 0) {
			return `${hours}h ${minutes}m`
		}
		return `${minutes}m`
	}

	const getProgress = (currentTime: number, duration: number): number => {
		return Math.round((currentTime / duration) * 100)
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

	const handleContinueWatching = (movieId: string, currentTime?: number) => {
		onClose()
		// Navigate to watch page with timestamp
		const url = currentTime ? `/movies/${movieId}/watch?t=${currentTime}` : `/movies/${movieId}/watch`
		window.location.href = url
	}

	const handleRemoveHistory = async (movieId: string) => {
		try {
			// Remove from local state immediately for better UX
			setWatchingHistory(prev => prev.filter(item => item.id !== movieId))
			// TODO: Call API to remove from history when endpoint is available
			console.log('Remove history item:', movieId)
		} catch (error) {
			console.error('Failed to remove history item:', error)
			// Refresh the list on error
			const movies = await movieService.getContinueWatching()
			setWatchingHistory(movies)
		}
	}

	const modalContent = (
		<div className="modal-overlay" onClick={onClose}>
			<div className="watching-history-modal" onClick={(e) => e.stopPropagation()}>
				<button className="modal-close-btn" onClick={onClose}>
					<X size={24} />
				</button>

				<div className="watching-history-content">
					{/* Header */}
					<div className="watching-history-header">
						<div className="watching-icon-wrapper">
							<Clock size={40} className="watching-icon" />
						</div>
						<h2 className="watching-history-title">Watching History</h2>
						<p className="watching-history-subtitle">
							Continue watching from where you left off
						</p>
					</div>

					{/* History List */}
					<div className="watching-history-list">
						{loading ? (
							<div className="history-loading">Loading...</div>
						) : watchingHistory.length > 0 ? (
							watchingHistory.map((item) => (
								<div key={item.id} className="watching-history-item">
									<div className="history-item-image">
										<img src={item.thumbnailUrl || item.image || '/placeholder.jpg'} alt={item.title} />
										<div className="play-overlay" onClick={() => handleContinueWatching(item.id, item.currentTime)}>
											<Play size={32} fill="currentColor" />
										</div>
									</div>

									<div className="history-item-details">
										<div className="history-item-header">
											<h3 className="history-item-title">{item.title}</h3>
											<button
												className="history-remove-btn"
												onClick={() => handleRemoveHistory(item.id)}
												title="Remove from history"
											>
												<Trash2 size={18} />
											</button>
										</div>

										{(item.season && item.episode) && (
											<div className="history-item-episode">
												Season {item.season}, Episode {item.episode}
											</div>
										)}

										{item.currentTime !== undefined && item.duration && (
											<div className="history-item-progress">
												<div className="progress-bar">
													<div
														className="progress-fill"
														style={{ width: `${getProgress(item.currentTime, item.duration)}%` }}
													></div>
												</div>
												<div className="progress-info">
													<span className="progress-text">
														{formatTime(item.currentTime)} / {formatTime(item.duration)}
													</span>
													<span className="progress-percentage">
														{getProgress(item.currentTime, item.duration)}%
													</span>
												</div>
											</div>
										)}

										<div className="history-item-footer">
											{item.lastWatchedAt && (
												<span className="last-watched">
													<Clock size={14} />
													{formatDate(item.lastWatchedAt)}
												</span>
											)}
											<button
												className="btn-continue"
												onClick={() => handleContinueWatching(item.id, item.currentTime)}
											>
												<Play size={16} />
												Continue Watching
											</button>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="history-empty">
								<Film size={64} className="empty-icon" />
								<h3 className="empty-title">No watching history</h3>
								<p className="empty-message">
									Start watching movies and shows to see your progress here
								</p>
							</div>
						)}
					</div>

					{/* Clear All Button */}
					{watchingHistory.length > 0 && (
						<button className="btn-clear-all">
							Clear All History
						</button>
					)}
				</div>
			</div>
		</div>
	)

	return createPortal(modalContent, document.body)
}

export default WatchingHistoryModal

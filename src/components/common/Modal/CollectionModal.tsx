import { createPortal } from 'react-dom'
import { X, Bookmark, Play, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collectionService } from '../../../services/interaction/collectionService'
import './CollectionModal.css'
import type { Collection } from '@/types/collection.types'

interface CollectionModalProps {
	isOpen: boolean
	onClose: () => void
}

export const CollectionModal = ({ isOpen, onClose }: CollectionModalProps) => {
	const navigate = useNavigate()
	const [collections, setCollections] = useState<Collection[]>([])
	const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	// Fetch collections from API
	useEffect(() => {
		const fetchCollections = async () => {
			if (!isOpen) return

			try {
				setLoading(true)
				const data = await collectionService.getUserCollections()
				setCollections(data)

				// Set first collection as active, or null if no collections
				if (data.length > 0) {
					setActiveCollectionId(data[0]._id)
				} else {
					setActiveCollectionId(null)
				}
			} catch (error) {
				console.error('Failed to fetch collections:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchCollections()
	}, [isOpen])

	if (!isOpen) return null

	const handleRemoveItem = async (collectionId: string, contentId: string) => {
		try {
			await collectionService.removeItemFromCollection(collectionId, contentId)
			// Refresh collections after removal
			const data = await collectionService.getUserCollections()

			// Auto-delete empty collections
			const collectionsWithoutEmpty = data.filter(collection => collection.itemCount > 0)

			if (collectionsWithoutEmpty.length < data.length) {
				// Some empty collections were found, delete them
				const emptyCollections = data.filter(collection => collection.itemCount === 0)
				for (const emptyCollection of emptyCollections) {
					try {
						await collectionService.deleteCollection(emptyCollection._id)
					} catch (deleteError) {
						console.error(`Failed to delete empty collection ${emptyCollection._id}:`, deleteError)
					}
				}
				setCollections(collectionsWithoutEmpty)
			} else {
				setCollections(data)
			}
		} catch (error) {
			console.error('Failed to remove item:', error)
		}
	}

	const getActiveCollection = () => {
		return collections.find((c) => c._id === activeCollectionId)
	}

	const handlePlayMovie = (contentId: string, contentType: string) => {
		onClose()
		if (contentType === 'movie') {
			navigate(`/movies/${contentId}/watch`)
		} else if (contentType === 'book') {
			navigate(`/books/${contentId}/read`)
		}
	}

	const renderCollectionItems = () => {
		const activeCollection = getActiveCollection()

		if (loading) {
			return <div className="collection-loading">Loading...</div>
		}

		if (!activeCollection || activeCollection.items.length === 0) {
			return (
				<div className="collection-empty">
					<Bookmark size={64} className="empty-icon" />
					<h3 className="empty-title">No items yet</h3>
					<p className="empty-message">
						Start adding your favorite content to this collection
					</p>
				</div>
			)
		}

		return (
			<div className="collection-grid">
				{activeCollection.items.map((item) => (
					<div key={item.contentId} className="collection-item-card">
						<div className="collection-item-image-wrapper">
							<img src={item.thumbnail || '/placeholder.jpg'} alt={item.title} />
							<div className="collection-item-overlay">
								<button
									className="overlay-btn play"
									title="Play"
									onClick={() => handlePlayMovie(item.contentId, item.contentType)}
								>
									<Play size={20} />
								</button>
								<button
									className="overlay-btn delete"
									title="Remove"
									onClick={() => handleRemoveItem(activeCollectionId!, item.contentId)}
								>
									<Trash2 size={20} />
								</button>
							</div>
						</div>
						<div className="collection-item-details">
							<h4 className="collection-item-title">{item.title}</h4>
							<div className="collection-item-type">
								{item.contentType === 'movie' ? '🎬 Movie' : '📖 Book'}
							</div>
							<span className="collection-item-date">
								Added {new Date(item.addedAt).toLocaleDateString('en-CA')}
							</span>
						</div>
					</div>
				))}
			</div>
		)
	}

	const modalContent = (
		<div className="modal-overlay" onClick={onClose}>
			<div className="collection-modal" onClick={(e) => e.stopPropagation()}>
				<button className="modal-close-btn" onClick={onClose}>
					<X size={24} />
				</button>

				<div className="collection-modal-content">
					{/* Header */}
					<div className="collection-header">
						<div className="collection-icon-wrapper">
							<Bookmark size={40} className="collection-icon" />
						</div>
						<h2 className="collection-title">My Collections</h2>
						<p className="collection-subtitle">Your saved content organized by collections</p>
					</div>

					{/* Tabs - Collection List */}
					<div className="collection-tabs">
						{collections.length === 0 ? (
							<div className="no-collections-message">
								<p>No collections yet. Create one to get started!</p>
							</div>
						) : (
							collections.map((collection) => (
								<button
									key={collection._id}
									className={`collection-tab ${
										activeCollectionId === collection._id ? 'active' : ''
									}`}
									onClick={() => setActiveCollectionId(collection._id)}
									title={`${collection.name} - ${collection.itemCount} items`}
								>
									<div className="collection-tab-info">
										<span className="collection-tab-name">{collection.name}</span>
										<span className="collection-tab-meta">
											{collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'} •{' '}
											{collection.privacy === 'public' ? 'Public' : 'Private'}
										</span>
									</div>
								</button>
							))
						)}
					</div>

					{/* Content */}
					<div className="collection-content">{renderCollectionItems()}</div>
				</div>
			</div>
		</div>
	)

	return createPortal(modalContent, document.body)
}

export default CollectionModal

import { createPortal } from 'react-dom'
import { X, FolderPlus, Plus, Check, Crown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { collectionService } from '@/services/interaction/collectionService'
import { NotificationModal } from './NotificationModal'
import { CreateCollectionModal } from './CreateCollectionModal'
import { useAuth } from '@/hooks/useAuth'
import type { NotificationType } from './NotificationModal'
import type { Collection, CollectionItemType } from '@/types/collection.types'
import './AddToCollectionModal.css'

interface AddToCollectionModalProps {
	isOpen: boolean
	onClose: () => void
	contentId: string
	contentType: CollectionItemType
	contentTitle: string
	contentThumbnail?: string
}

export const AddToCollectionModal = ({
	isOpen,
	onClose,
	contentId,
	contentType,
	contentTitle,
	contentThumbnail,
}: AddToCollectionModalProps) => {
	const { user } = useAuth()
	const [collections, setCollections] = useState<Collection[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [addingToCollection, setAddingToCollection] = useState<string | null>(null)
	const [showCreateModal, setShowCreateModal] = useState(false)

	// Collection limits
	const MAX_COLLECTIONS_CLASSIC = 5
	const isPremium = user?.isPremium || false
	const canCreateMore = isPremium || collections.length < MAX_COLLECTIONS_CLASSIC

	// Notification state
	const [showNotification, setShowNotification] = useState(false)
	const [notificationType, setNotificationType] = useState<NotificationType>('info')
	const [notificationMessage, setNotificationMessage] = useState('')

	// Load user's collections
	useEffect(() => {
		if (isOpen) {
			loadCollections()
		}
	}, [isOpen])

	const loadCollections = async () => {
		setIsLoading(true)
		try {
			const data = await collectionService.getUserCollections()
			setCollections(data)
		} catch (error) {
			console.error('Failed to load collections:', error)
			showNotificationModal('error', 'Failed to load collections. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	if (!isOpen) return null

	const showNotificationModal = (type: NotificationType, message: string) => {
		setNotificationType(type)
		setNotificationMessage(message)
		setShowNotification(true)
	}

	const isItemInCollection = (collection: Collection): boolean => {
		return collection.items.some((item) => item.contentId === contentId)
	}

	const handleAddToCollection = async (collectionId: string) => {
		setAddingToCollection(collectionId)

		try {
			await collectionService.addItemToCollection(collectionId, {
				contentId,
				contentType,
				title: contentTitle,
				thumbnail: contentThumbnail,
			})

			showNotificationModal('success', 'Added to collection successfully!')

			// Reload collections to update UI
			await loadCollections()

			// Close modal after a short delay
			setTimeout(() => {
				onClose()
			}, 1500)
		} catch (error: any) {
			console.error('Failed to add to collection:', error)
			const errorMessage =
				error.response?.data?.message || 'Failed to add to collection. Please try again.'
			showNotificationModal('error', errorMessage)
		} finally {
			setAddingToCollection(null)
		}
	}

	const handleCreateSuccess = async (newCollection: Collection) => {
		setShowCreateModal(false)

		// Automatically add the item to the newly created collection
		try {
			await collectionService.addItemToCollection(newCollection._id, {
				contentId,
				contentType,
				title: contentTitle,
				thumbnail: contentThumbnail,
			})

			showNotificationModal('success', 'Collection created and item added successfully!')

			// Reload collections to update UI
			await loadCollections()

			// Close modal after a short delay
			setTimeout(() => {
				onClose()
			}, 1500)
		} catch (error: any) {
			console.error('Failed to add item to new collection:', error)
			const errorMessage =
				error.response?.data?.message || 'Collection created but failed to add item. Please try again.'
			showNotificationModal('error', errorMessage)

			// Still reload collections to show the new collection
			await loadCollections()
		}
	}

	const modalContent = (
		<div className="add-to-collection-overlay" onClick={onClose}>
			<div className="add-to-collection-modal" onClick={(e) => e.stopPropagation()}>
				<button className="add-to-collection-close" onClick={onClose}>
					<X size={24} />
				</button>

				<div className="add-to-collection-content">
					{/* Header */}
					<div className="add-to-collection-header">
						<FolderPlus size={40} className="add-to-collection-icon" />
						<h2 className="add-to-collection-title">Add to Collection</h2>
						<p className="add-to-collection-subtitle">
							Save "{contentTitle}" to your collection
						</p>
					</div>

					{/* Create New Collection Button */}
					<button
						className="btn-create-new"
						onClick={() => {
							if (!canCreateMore) {
								showNotificationModal('warning',
									`You've reached the limit of ${MAX_COLLECTIONS_CLASSIC} collections for Classic plan. Upgrade to Premium for unlimited collections!`)
								return
							}
							setShowCreateModal(true)
						}}
						disabled={isLoading}
					>
						<Plus size={20} />
						<span>Create New Collection</span>
						{!isPremium && (
							<span className="collection-limit">
								({collections.length}/{MAX_COLLECTIONS_CLASSIC})
							</span>
						)}
					</button>

					{!canCreateMore && (
						<div className="upgrade-banner">
							<Crown size={20} />
							<p>
								<strong>Upgrade to Premium</strong> for unlimited collections!
							</p>
						</div>
					)}

					{/* Collections List */}
					{isLoading ? (
						<div className="collections-loading">
							<div className="loading-spinner"></div>
							<p>Loading your collections...</p>
						</div>
					) : collections.length === 0 ? (
						<div className="collections-empty">
							<FolderPlus size={64} className="empty-icon" />
							<h3 className="empty-title">No Collections Yet</h3>
							<p className="empty-message">
								Create your first collection to start organizing your content
							</p>
						</div>
					) : (
						<div className="collections-list">
							{collections.map((collection) => {
								const isAdded = isItemInCollection(collection)
								const isAdding = addingToCollection === collection._id

								return (
									<div
										key={collection._id}
										className={`collection-item ${isAdded ? 'added' : ''}`}
									>
										<div className="collection-item-info">
											<h4 className="collection-item-name">{collection.name}</h4>
											<p className="collection-item-meta">
												{collection.itemCount}{' '}
												{collection.itemCount === 1 ? 'item' : 'items'} •{' '}
												{collection.privacy === 'public' ? 'Public' : 'Private'}
											</p>
											{collection.description && (
												<p className="collection-item-desc">{collection.description}</p>
											)}
										</div>

										<button
											className={`btn-add ${isAdded ? 'added' : ''}`}
											onClick={() =>
												!isAdded && !isAdding && handleAddToCollection(collection._id)
											}
											disabled={isAdded || isAdding}
										>
											{isAdding ? (
												<>
													<div className="button-spinner"></div>
													<span>Adding...</span>
												</>
											) : isAdded ? (
												<>
													<Check size={18} />
													<span>Added to {collection.name}</span>
												</>
											) : (
												<>
													<Plus size={18} />
													<span>Add</span>
												</>
											)}
										</button>
									</div>
								)
							})}
						</div>
					)}
				</div>
			</div>

			<NotificationModal
				isOpen={showNotification}
				onClose={() => setShowNotification(false)}
				type={notificationType}
				message={notificationMessage}
			/>

			<CreateCollectionModal
				isOpen={showCreateModal}
				onClose={() => setShowCreateModal(false)}
				onSuccess={handleCreateSuccess}
			/>
		</div>
	)

	return createPortal(modalContent, document.body)
}

export default AddToCollectionModal

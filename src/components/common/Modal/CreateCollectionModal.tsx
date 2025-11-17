import { createPortal } from 'react-dom'
import { X, FolderPlus, Lock, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { collectionService } from '@/services/interaction/collectionService'
import { NotificationModal } from './NotificationModal'
import type { NotificationType } from './NotificationModal'
import type { Collection, CollectionPrivacy } from '@/types/collection.types'
import './CreateCollectionModal.css'

interface CreateCollectionModalProps {
	isOpen: boolean
	onClose: () => void
	onSuccess?: (collection: Collection) => void
	editCollection?: Collection | null
}

export const CreateCollectionModal = ({
	isOpen,
	onClose,
	onSuccess,
	editCollection,
}: CreateCollectionModalProps) => {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [privacy, setPrivacy] = useState<CollectionPrivacy>('private')
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Notification state
	const [showNotification, setShowNotification] = useState(false)
	const [notificationType, setNotificationType] = useState<NotificationType>('info')
	const [notificationMessage, setNotificationMessage] = useState('')

	// Load edit collection data
	useEffect(() => {
		if (editCollection) {
			setName(editCollection.name)
			setDescription(editCollection.description || '')
			setPrivacy(editCollection.privacy)
		} else {
			// Reset form for new collection
			setName('')
			setDescription('')
			setPrivacy('private')
		}
	}, [editCollection, isOpen])

	if (!isOpen) return null

	const showNotificationModal = (type: NotificationType, message: string) => {
		setNotificationType(type)
		setNotificationMessage(message)
		setShowNotification(true)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// Validation
		if (!name.trim()) {
			showNotificationModal('error', 'Please enter a collection name')
			return
		}

		if (name.length > 50) {
			showNotificationModal('error', 'Collection name must be less than 50 characters')
			return
		}

		if (description.length > 200) {
			showNotificationModal('error', 'Description must be less than 200 characters')
			return
		}

		setIsSubmitting(true)

		try {
			let result: Collection

			if (editCollection) {
				// Update existing collection
				result = await collectionService.updateCollection(editCollection._id, {
					name: name.trim(),
					description: description.trim() || undefined,
					privacy,
				})
				showNotificationModal('success', 'Collection updated successfully!')
			} else {
				// Create new collection
				result = await collectionService.createCollection({
					name: name.trim(),
					description: description.trim() || undefined,
					privacy,
				})
				showNotificationModal('success', 'Collection created successfully!')
			}

			// Call success callback
			if (onSuccess) {
				onSuccess(result)
			}

			// Close modal after a short delay
			setTimeout(() => {
				onClose()
			}, 1500)
		} catch (error: any) {
			console.error('Failed to save collection:', error)
			const errorMessage =
				error.response?.data?.message ||
				`Failed to ${editCollection ? 'update' : 'create'} collection. Please try again.`
			showNotificationModal('error', errorMessage)
		} finally {
			setIsSubmitting(false)
		}
	}

	const modalContent = (
		<div className="create-collection-overlay" onClick={onClose}>
			<div className="create-collection-modal" onClick={(e) => e.stopPropagation()}>
				<button className="create-collection-close" onClick={onClose}>
					<X size={24} />
				</button>

				<div className="create-collection-content">
					{/* Header */}
					<div className="create-collection-header">
						<FolderPlus size={40} className="create-collection-icon" />
						<h2 className="create-collection-title">
							{editCollection ? 'Edit Collection' : 'Create New Collection'}
						</h2>
						<p className="create-collection-subtitle">
							{editCollection
								? 'Update your collection details'
								: 'Organize your favorite movies and books'}
						</p>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="create-collection-form">
						{/* Name Input */}
						<div className="form-group">
							<label htmlFor="collection-name" className="form-label">
								Collection Name <span className="required">*</span>
							</label>
							<input
								id="collection-name"
								type="text"
								className="form-input"
								placeholder="e.g., My Favorite Anime"
								value={name}
								onChange={(e) => setName(e.target.value)}
								maxLength={50}
								disabled={isSubmitting}
							/>
							<span className="form-hint">{name.length}/50 characters</span>
						</div>

						{/* Description Input */}
						<div className="form-group">
							<label htmlFor="collection-description" className="form-label">
								Description
							</label>
							<textarea
								id="collection-description"
								className="form-textarea"
								placeholder="Brief description of your collection (optional)"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								maxLength={200}
								rows={3}
								disabled={isSubmitting}
							/>
							<span className="form-hint">{description.length}/200 characters</span>
						</div>

						{/* Privacy Setting */}
						<div className="form-group">
							<label className="form-label">Privacy</label>
							<div className="privacy-options">
								<button
									type="button"
									className={`privacy-option ${privacy === 'private' ? 'active' : ''}`}
									onClick={() => setPrivacy('private')}
									disabled={isSubmitting}
								>
									<Lock size={20} />
									<div className="privacy-option-text">
										<span className="privacy-option-title">Private</span>
										<span className="privacy-option-desc">Only you can see this collection</span>
									</div>
								</button>

								<button
									type="button"
									className={`privacy-option ${privacy === 'public' ? 'active' : ''}`}
									onClick={() => setPrivacy('public')}
									disabled={isSubmitting}
								>
									<Globe size={20} />
									<div className="privacy-option-text">
										<span className="privacy-option-title">Public</span>
										<span className="privacy-option-desc">
											Everyone can see this collection
										</span>
									</div>
								</button>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="form-actions">
							<button
								type="button"
								className="btn-cancel"
								onClick={onClose}
								disabled={isSubmitting}
							>
								Cancel
							</button>
							<button type="submit" className="btn-submit" disabled={isSubmitting}>
								{isSubmitting
									? 'Saving...'
									: editCollection
										? 'Update Collection'
										: 'Create Collection'}
							</button>
						</div>
					</form>
				</div>
			</div>

			<NotificationModal
				isOpen={showNotification}
				onClose={() => setShowNotification(false)}
				type={notificationType}
				message={notificationMessage}
			/>
		</div>
	)

	return createPortal(modalContent, document.body)
}

export default CreateCollectionModal

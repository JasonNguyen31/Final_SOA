import { createPortal } from 'react-dom'
import { X, User, Mail, Calendar, Shield, Camera, Edit2, Trash2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { userService } from '@/services/user/userService'
import './ProfileModal.css'

interface ProfileModalProps {
	isOpen: boolean
	onClose: () => void
}

export const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
	const { user, updateUser } = useAuth()
	const [isEditingDisplayName, setIsEditingDisplayName] = useState(false)
	const [displayName, setDisplayName] = useState(user?.displayName || user?.username || '')
	const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '')
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
	const [isLoadingProfile, setIsLoadingProfile] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Fetch latest user profile when modal opens
	useEffect(() => {
		if (isOpen) {
			fetchLatestProfile()
		}
	}, [isOpen])

	const fetchLatestProfile = async () => {
		try {
			setIsLoadingProfile(true)
			const latestProfile = await userService.getProfile()
			updateUser(latestProfile)
			setDisplayName(latestProfile.displayName || latestProfile.username || '')
			setAvatarUrl(latestProfile.avatar || '')
		} catch (error) {
			console.error('Failed to fetch latest profile:', error)
		} finally {
			setIsLoadingProfile(false)
		}
	}

	if (!isOpen) return null

	const handleDisplayNameSave = async () => {
		if (!displayName.trim()) {
			return
		}

		try {
			// Call API to update display name
			const updatedProfile = await userService.updateProfile({ displayName: displayName.trim() })

			// Fetch latest profile to ensure we have all updated data
			await fetchLatestProfile()

			setIsEditingDisplayName(false)
		} catch (error) {
			console.error('Failed to update display name:', error)
		}
	}

	const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		// Validate file type
		if (!file.type.startsWith('image/')) {
			console.error('Invalid file type')
			return
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			console.error('File size too large')
			return
		}

		try {
			setIsUploadingAvatar(true)

			// Convert image to base64 or data URL
			const reader = new FileReader()
			reader.onloadend = async () => {
				const base64String = reader.result as string

				try {
					// Update avatar with base64 data URL
					await userService.updateProfile({ avatar: base64String })

					// Fetch latest profile
					await fetchLatestProfile()
				} catch (error) {
					console.error('Failed to update avatar:', error)
				} finally {
					setIsUploadingAvatar(false)
				}
			}
			reader.onerror = () => {
				console.error('Failed to read image file')
				setIsUploadingAvatar(false)
			}
			reader.readAsDataURL(file)
		} catch (error) {
			console.error('Failed to upload avatar:', error)
			setIsUploadingAvatar(false)
		}
	}

	const handleAvatarDelete = async () => {
		try {
			// Call API to delete avatar (send empty string)
			await userService.updateProfile({ avatar: '' })

			// Fetch latest profile
			await fetchLatestProfile()
		} catch (error) {
			console.error('Failed to delete avatar:', error)
		}
	}

	const formatMemberSince = (dateString?: string) => {
		if (!dateString) return 'N/A'
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	const modalContent = (
		<div className="modal-overlay" onClick={onClose}>
			<div className="profile-modal" onClick={(e) => e.stopPropagation()}>
				<button className="modal-close-btn" onClick={onClose}>
					<X size={24} />
				</button>

				<div className="profile-modal-content">
					<div className="profile-header">
						<div className="profile-avatar-large">
							{avatarUrl ? (
								<img src={avatarUrl} alt="Avatar" className="avatar-image-large" />
							) : (
								<div className="avatar-circle-large"></div>
							)}
							<div className="avatar-actions">
								<button
									className="avatar-action-btn upload"
									onClick={() => fileInputRef.current?.click()}
									disabled={isUploadingAvatar}
									title="Upload/Change Avatar"
								>
									<Camera size={16} />
								</button>
								{avatarUrl && (
									<button
										className="avatar-action-btn delete"
										onClick={handleAvatarDelete}
										title="Delete Avatar"
									>
										<Trash2 size={16} />
									</button>
								)}
							</div>
							
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleAvatarUpload}
								style={{ display: 'none' }}
							/>
						</div>
						<h2 className="profile-name">{user?.displayName || user?.username || 'User'}</h2>
						<span className="profile-email">{user?.email || 'user@example.com'}</span>
						{user?.isPremium && (
							<span className="profile-premium-badge">Premium Member</span>
						)}
					</div>

					<div className="profile-details">
						{/* Display Name */}
						<div className="profile-detail-item profile-detail-item-inline">
							<User size={20} className="profile-icon" />
							<div className="profile-detail-content profile-detail-content-inline">
								<span className="profile-detail-label">Display Name</span>
								{isEditingDisplayName ? (
									<div className="edit-display-name">
										<input
											type="text"
											value={displayName}
											onChange={(e) => setDisplayName(e.target.value)}
											className="display-name-input"
											placeholder="Enter display name"
											autoFocus
										/>
										<div className="edit-actions">
											<button className="btn-save" onClick={handleDisplayNameSave}>
												Save
											</button>
											<button
												className="btn-cancel"
												onClick={() => {
													setDisplayName(user?.displayName || user?.username || '')
													setIsEditingDisplayName(false)
												}}
											>
												Cancel
											</button>
										</div>
									</div>
								) : (
									<div className="display-name-view">
										<span className="profile-detail-value">
											{user?.displayName || user?.username || 'Not set'}
										</span>
										<button
											className="btn-edit-inline"
											onClick={() => setIsEditingDisplayName(true)}
											title="Edit display name"
										>
											<Edit2 size={16} />
										</button>
									</div>
								)}
							</div>
						</div>

						{/* Username */}
						<div className="profile-detail-item">
							<User size={20} className="profile-icon" />
							<div className="profile-detail-content">
								<span className="profile-detail-label">Username</span>
								<span className="profile-detail-value">{user?.username || 'user123'}</span>
							</div>
						</div>

						{/* Email */}
						<div className="profile-detail-item">
							<Mail size={20} className="profile-icon" />
							<div className="profile-detail-content">
								<span className="profile-detail-label">Email Address</span>
								<span className="profile-detail-value">{user?.email || 'user@example.com'}</span>
							</div>
						</div>

						{/* Member Since - Ngày tham gia */}
						<div className="profile-detail-item">
							<Calendar size={20} className="profile-icon" />
							<div className="profile-detail-content">
								<span className="profile-detail-label">Joined Date</span>
								<span className="profile-detail-value">
									{formatMemberSince(user?.createdAt)}
								</span>
							</div>
						</div>

						{/* Account Type */}
						<div className="profile-detail-item">
							<Shield size={20} className="profile-icon" />
							<div className="profile-detail-content">
								<span className="profile-detail-label">Account Type</span>
								<span className="profile-detail-value">
									{user?.isPremium ? 'Premium Account' : 'Classic Account'}
								</span>
							</div>
						</div>
					</div>

					<div className="profile-actions">
						{!user?.isPremium && (
							<button className="btn-upgrade-premium" onClick={() => {
								onClose()
								window.location.href = '/premium'
							}}>
								Upgrade to Premium
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)

	return createPortal(modalContent, document.body)
}

export default ProfileModal

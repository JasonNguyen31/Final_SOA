export interface User {
	id: string
	email: string
	username: string
	displayName?: string
	fullName?: string
	name?: string // For backward compatibility
	role: 'user' | 'admin' | 'moderator'
	avatar?: string
	isPremium: boolean
	walletBalance?: number
	premiumExpiryDate?: string
	createdAt?: string
	updatedAt?: string
}

export interface UserProfile extends User {
	bio?: string
	phone?: string
	dateOfBirth?: string
	preferences?: UserPreferences
}

export interface UserPreferences {
	notifications: {
		email: boolean
		push: boolean
		updates: boolean
	}
	privacy: {
		showProfile: boolean
		showActivity: boolean
	}
	language: string
	timezone: string
}

export interface UpdateProfileData {
	name?: string
	bio?: string
	phone?: string
	dateOfBirth?: string
	avatar?: string
}

export interface ChangePasswordData {
	currentPassword: string
	newPassword: string
	confirmPassword: string
}

export interface Transaction {
	id: string
	userId: string
	type: 'premium_upgrade' | 'premium_renewal'
	amount: number
	description: string
	status: 'completed' | 'pending' | 'failed'
	createdAt: string
}

export interface PremiumPackage {
	id: string
	name: string
	duration: number // in months
	price: number
	features: string[]
	popular?: boolean
}

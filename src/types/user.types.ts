export interface User {
	id: string
	email: string
	name: string
	role: 'user' | 'admin'
	avatar?: string
	isPremium: boolean
	createdAt: string
	updatedAt: string
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

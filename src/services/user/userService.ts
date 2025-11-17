import axios, { type AxiosInstance } from 'axios'
import { authInterceptor } from '@/core/api/interceptors/auth.interceptor'
import { errorInterceptor } from '@/core/api/interceptors/error.interceptor'
import type { User } from '@/core/storage/storageService'

// Create dedicated axios instance for user service
const USER_SERVICE_BASE_URL = 'http://localhost:8002/api'

const userServiceClient: AxiosInstance = axios.create({
	baseURL: USER_SERVICE_BASE_URL,
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
})

// Add auth interceptor
userServiceClient.interceptors.request.use(
	authInterceptor.onRequest,
	authInterceptor.onRequestError
)

// Add error interceptor
userServiceClient.interceptors.response.use(
	errorInterceptor.onResponse,
	errorInterceptor.onResponseError
)

export interface UpdateProfileData {
	fullName?: string
	displayName?: string
	avatar?: string
	language?: string
}

export interface ChangePasswordData {
	oldPassword: string
	newPassword: string
	newPasswordConfirmation: string
}

export interface UserSettings {
	notifications: {
		email: boolean
		push: boolean
		comments: boolean
		newContent: boolean
	}
	privacy: {
		showWatchHistory: boolean
		showReadHistory: boolean
	}
}

class UserService {
	async getProfile(): Promise<User> {
		const response = await userServiceClient.get<{ data: User }>('/user/profile')
		return response.data.data
	}

	async updateProfile(data: UpdateProfileData): Promise<User> {
		const response = await userServiceClient.put<{ data: User }>('/user/profile', data)
		return response.data.data
	}

	async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
		const response = await userServiceClient.post<{ message: string }>('/user/change-password', data)
		return response.data
	}

	async getSettings(): Promise<UserSettings> {
		const response = await userServiceClient.get<{ data: UserSettings }>('/user/settings')
		return response.data.data
	}

	async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
		const response = await userServiceClient.put<{ data: UserSettings }>('/user/settings', settings)
		return response.data.data
	}

	async getWallet(page: number = 1, limit: number = 20): Promise<any> {
		const response = await userServiceClient.get(`/user/wallet?page=${page}&limit=${limit}`)
		return response.data.data
	}

	async upgradePremium(duration: number, amount: number): Promise<User> {
		const response = await userServiceClient.post<{ data: { user: User } }>('/user/premium/upgrade', {
			duration,
			amount
		})
		return response.data.data.user
	}
}

export const userService = new UserService()

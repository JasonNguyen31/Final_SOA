// API Endpoints
export const API_ENDPOINTS = {
	// Auth endpoints
	AUTH: {
		LOGIN: '/auth/login',
		REGISTER: '/auth/register',
		LOGOUT: '/auth/logout',
		REFRESH: '/auth/refresh',
		FORGOT_PASSWORD: '/auth/forgot-password',
		RESET_PASSWORD: '/auth/reset-password',
		VERIFY_EMAIL: '/auth/verify-email',
	},

	// User endpoints
	USER: {
		PROFILE: '/user/profile',
		UPDATE_PROFILE: '/user/profile',
		CHANGE_PASSWORD: '/user/change-password',
		SETTINGS: '/user/settings',
		NOTIFICATIONS: '/user/notifications',
		PREFERENCES: '/user/preferences',
	},

	// Content endpoints
	CONTENT: {
		LIST: '/content',
		CREATE: '/content',
		GET: (id: string) => `/content/${id}`,
		UPDATE: (id: string) => `/content/${id}`,
		DELETE: (id: string) => `/content/${id}`,
		LIKE: (id: string) => `/content/${id}/like`,
		UNLIKE: (id: string) => `/content/${id}/unlike`,
		BOOKMARK: (id: string) => `/content/${id}/bookmark`,
		REPORT: (id: string) => `/content/${id}/report`,
	},

	// Comment endpoints
	COMMENT: {
		LIST: (contentId: string) => `/content/${contentId}/comments`,
		CREATE: (contentId: string) => `/content/${contentId}/comments`,
		GET: (id: string) => `/comments/${id}`,
		UPDATE: (id: string) => `/comments/${id}`,
		DELETE: (id: string) => `/comments/${id}`,
		LIKE: (id: string) => `/comments/${id}/like`,
	},

	// Notification endpoints
	NOTIFICATION: {
		LIST: '/notifications',
		GET: (id: string) => `/notifications/${id}`,
		MARK_READ: (id: string) => `/notifications/${id}/read`,
		MARK_ALL_READ: '/notifications/read-all',
		DELETE: (id: string) => `/notifications/${id}`,
	},

	// Payment endpoints
	PAYMENT: {
		CREATE_SUBSCRIPTION: '/payments/subscription',
		CANCEL_SUBSCRIPTION: '/payments/subscription/cancel',
		UPDATE_PAYMENT_METHOD: '/payments/method',
		PAYMENT_HISTORY: '/payments/history',
		INVOICES: '/payments/invoices',
	},

	// Admin endpoints
	ADMIN: {
		USERS: {
			LIST: '/admin/users',
			GET: (id: string) => `/admin/users/${id}`,
			UPDATE: (id: string) => `/admin/users/${id}`,
			DELETE: (id: string) => `/admin/users/${id}`,
			SUSPEND: (id: string) => `/admin/users/${id}/suspend`,
		},
		CONTENT: {
			LIST: '/admin/content',
			GET: (id: string) => `/admin/content/${id}`,
			APPROVE: (id: string) => `/admin/content/${id}/approve`,
			REJECT: (id: string) => `/admin/content/${id}/reject`,
			DELETE: (id: string) => `/admin/content/${id}`,
		},
		REPORTS: {
			LIST: '/admin/reports',
			GET: (id: string) => `/admin/reports/${id}`,
			RESOLVE: (id: string) => `/admin/reports/${id}/resolve`,
		},
		ANALYTICS: {
			DASHBOARD: '/admin/analytics/dashboard',
			USERS: '/admin/analytics/users',
			CONTENT: '/admin/analytics/content',
			REVENUE: '/admin/analytics/revenue',
		},
	},
} as const

export default API_ENDPOINTS

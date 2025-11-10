import axios from 'axios'
import { setupInterceptors } from './interceptors'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Create axios instance
export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000, // 30 seconds
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true, // Send cookies with requests
})

// Setup interceptors
setupInterceptors(apiClient)

export default apiClient

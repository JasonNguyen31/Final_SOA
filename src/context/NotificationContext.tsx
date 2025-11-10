import { createContext, useContext, type ReactNode } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface NotificationContextType {
	success: (message: string) => void
	error: (message: string) => void
	info: (message: string) => void
	warning: (message: string) => void
	loading: (message: string) => string
	dismiss: (toastId?: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotification = () => {
	const context = useContext(NotificationContext)
	if (!context) {
		throw new Error('useNotification must be used within NotificationProvider')
	}
	return context
}

interface NotificationProviderProps {
	children: ReactNode
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
	const value: NotificationContextType = {
		success: (message: string) => {
			toast.success(message, {
				duration: 4000,
				position: 'top-right',
			})
		},
		error: (message: string) => {
			toast.error(message, {
				duration: 5000,
				position: 'top-right',
			})
		},
		info: (message: string) => {
			toast(message, {
				duration: 4000,
				position: 'top-right',
				icon: '9',
			})
		},
		warning: (message: string) => {
			toast(message, {
				duration: 4000,
				position: 'top-right',
				icon: ' ',
			})
		},
		loading: (message: string) => {
			return toast.loading(message, {
				position: 'top-right',
			})
		},
		dismiss: (toastId?: string) => {
			toast.dismiss(toastId)
		},
	}

	return (
		<NotificationContext.Provider value={value}>
			{children}
			<Toaster />
		</NotificationContext.Provider>
	)
}

export default NotificationContext

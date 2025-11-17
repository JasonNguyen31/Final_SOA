import React, { createContext, useContext, useState, type ReactNode } from 'react'
import { AuthModal } from '@/components/common/Modal/AuthModal'

interface AuthModalContextType {
	openLogin: () => void
	openRegister: () => void
	closeModal: () => void
	isOpen: boolean
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export const AuthModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [showModal, setShowModal] = useState(false)
	const [mode, setMode] = useState<'login' | 'register'>('login')

	const openLogin = () => {
		setMode('login')
		setShowModal(true)
	}

	const openRegister = () => {
		setMode('register')
		setShowModal(true)
	}

	const closeModal = () => {
		setShowModal(false)
	}

	const switchMode = () => {
		setMode(mode === 'login' ? 'register' : 'login')
	}

	return (
		<AuthModalContext.Provider value={{ openLogin, openRegister, closeModal, isOpen: showModal }}>
			{children}
			{showModal && (
				<AuthModal
					mode={mode}
					onClose={closeModal}
					onSwitchMode={switchMode}
				/>
			)}
		</AuthModalContext.Provider>
	)
}

export const useAuthModal = () => {
	const context = useContext(AuthModalContext)
	if (context === undefined) {
		throw new Error('useAuthModal must be used within an AuthModalProvider')
	}
	return context
}

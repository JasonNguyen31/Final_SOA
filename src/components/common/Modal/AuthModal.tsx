import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '@/components/form/LoginForm/LoginForm'
import { RegisterForm } from '@/components/form/RegisterForm/RegisterForm'
import { OTPForm } from '@/components/form/OTPForm/OTPForm'
import { ForgotPasswordForm } from '@/components/form/ForgotPasswordForm/ForgotPasswordForm'
import '@/styles/AuthModal.css'
import authBgImage from '@/assets/images/mm.jpg'

interface AuthModalProps {
    mode: 'login' | 'register'
    onClose: () => void
    onSwitchMode: () => void
}

export const AuthModal = ({ mode, onClose, onSwitchMode }: AuthModalProps) => {
    const navigate = useNavigate()
    const [currentMode, setCurrentMode] = useState<'login' | 'register' | 'otp' | 'forgot-password' | 'reset-password'>(mode)
    const [registeredEmail, setRegisteredEmail] = useState('')
    const [resetPasswordEmail, setResetPasswordEmail] = useState('')

    useEffect(() => {
        setCurrentMode(mode)
    }, [mode])

    useEffect(() => {
        const originalOverflow = document.body.style.overflow

        // Disable scroll
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = originalOverflow
        }
    }, [])

    const handleSuccessRegistration = (email: string) => {
        setRegisteredEmail(email)
        setCurrentMode('otp')
    }

    const handleBackToRegister = () => {
        setCurrentMode('register')
    }

    const handleSwitchToForgotPassword = () => {
        setCurrentMode('forgot-password')
    }

    const handleBackToLogin = () => {
        setCurrentMode('login')
    }

    const handleSuccessSendOTP = (email: string) => {
        setResetPasswordEmail(email)
        setCurrentMode('reset-password')
    }

    const handleBackToForgotPassword = () => {
        setCurrentMode('forgot-password')
    }

    const handleResetPasswordSuccess = () => {
        // Show success and redirect to login
        setCurrentMode('login')
        // Could show a success message here
    }

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Background Image */}
                <div className="auth-modal-background">
                    <img src={authBgImage} alt="background" />
                    <div className="auth-modal-overlay-gradient" />
                </div>

                {/* Close Button */}
                <button className="auth-modal-close" onClick={onClose}>
                    <X className="close-icon" />
                </button>

                {/* Content */}
                <div className="auth-modal-content">
                    {currentMode === 'login' ? (
                        <LoginForm
                            onSwitchToRegister={onSwitchMode}
                            onSwitchToForgotPassword={handleSwitchToForgotPassword}
                            onClose={onClose}
                        />
                    ) : currentMode === 'register' ? (
                        <RegisterForm
                            onSwitchToLogin={onSwitchMode}
                            onClose={onClose}
                            onSuccessRegistration={handleSuccessRegistration}
                        />
                    ) : currentMode === 'forgot-password' ? (
                        <ForgotPasswordForm
                            onBackToLogin={handleBackToLogin}
                            onSuccessSendOTP={handleSuccessSendOTP}
                        />
                    ) : currentMode === 'reset-password' ? (
                        <OTPForm
                            email={resetPasswordEmail}
                            onBack={handleBackToForgotPassword}
                            onSuccess={handleResetPasswordSuccess}
                            mode="reset-password"
                        />
                    ) : (
                        <OTPForm
                            email={registeredEmail}
                            onBack={handleBackToRegister}
                            onClose={onClose}
                            mode="register"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default AuthModal
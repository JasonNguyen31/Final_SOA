import { useState, useEffect } from 'react'
import { Mail } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import '@/styles/AuthModal.css'

interface ForgotPasswordFormProps {
    onBackToLogin: () => void
    onSuccessSendOTP?: (email: string) => void
}

export const ForgotPasswordForm = ({ onBackToLogin, onSuccessSendOTP }: ForgotPasswordFormProps) => {
    const [email, setEmail] = useState('')
    const [touched, setTouched] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [cooldownSeconds, setCooldownSeconds] = useState(0)
    const { forgotPassword, loading, error, clearError } = useAuth()

    // Cooldown timer
    useEffect(() => {
        if (cooldownSeconds > 0) {
            const timer = setTimeout(() => {
                setCooldownSeconds(cooldownSeconds - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [cooldownSeconds])

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const errors = {
        email: touched && !emailRegex.test(email) ? 'Please enter a valid email address' : ''
    }

    const isFormValid = emailRegex.test(email)

    const handleBlur = () => {
        setTouched(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched(true)

        if (!isFormValid || cooldownSeconds > 0) return

        try {
            await forgotPassword(email)
            setSuccessMessage('OTP code has been sent to your email. Please check your inbox.')
            // Set cooldown to prevent spam (60 seconds)
            setCooldownSeconds(60)

            // Switch to reset password form with OTP
            if (onSuccessSendOTP) {
                setTimeout(() => {
                    onSuccessSendOTP(email)
                }, 2000) // Show success message for 2 seconds before switching
            }
        } catch (err: any) {
            console.error('Forgot password failed:', err)
            // If rate limit error, set longer cooldown
            if (err?.status === 429 || err?.response?.status === 429) {
                setCooldownSeconds(120) // 2 minutes cooldown for rate limit
            }
        }
    }

    return (
        <div className="auth-form">
            <h2 className="auth-title">Forgot Password?</h2>
            <p className="auth-subtitle">
                Enter your email address and we'll send you a link to reset your password
            </p>

            <form onSubmit={handleSubmit} className="form-container">
                {/* Success Message */}
                {successMessage && (
                    <div className="form-success" style={{
                        background: 'rgba(76, 175, 80, 0.1)',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        color: '#4caf50',
                        fontSize: '14px',
                        marginBottom: '16px',
                        textAlign: 'center'
                    }}>
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {/* Email Field */}
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <div className="input-wrapper">
                        <Mail className="input-icon" />
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={handleBlur}
                            placeholder="Enter your registered email"
                            className={`form-input ${errors.email ? 'input-error' : ''}`}
                            required
                            autoFocus
                        />
                    </div>
                    {errors.email && (
                        <span className="field-error">{errors.email}</span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`submit-button ${(!isFormValid || cooldownSeconds > 0) && !loading ? 'button-disabled' : ''}`}
                    disabled={loading || !isFormValid || cooldownSeconds > 0}
                >
                    {loading ? 'Sending reset link...' :
                     cooldownSeconds > 0 ? `Wait ${cooldownSeconds}s before retry` :
                     'Send Reset Link'}
                </button>

                {/* Back to Login */}
                <p className="switch-text">
                    Remember your password?{' '}
                    <button type="button" onClick={onBackToLogin} className="switch-link">
                        Back to Login
                    </button>
                </p>
            </form>
        </div>
    )
}

export default ForgotPasswordForm

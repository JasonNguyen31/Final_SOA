import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react'
import { Mail, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import '@/styles/AuthModal.css'

interface OTPFormProps {
    email: string
    onBack: () => void
    onClose?: () => void
    mode?: 'register' | 'reset-password'
    onSuccess?: () => void
}

export const OTPForm = ({ email, onBack, onClose, mode = 'register', onSuccess }: OTPFormProps) => {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [touched, setTouched] = useState({
        newPassword: false,
        confirmPassword: false
    })
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const { verifyOTP, resetPassword, loading, error } = useAuth()

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, 6)

        if (!/^\d+$/.test(pastedData)) return

        const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''))
        setOtp(newOtp)

        // Focus the next empty input or the last one
        const nextIndex = Math.min(pastedData.length, 5)
        inputRefs.current[nextIndex]?.focus()
    }

    // Password validation for reset mode
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    const passwordErrors = {
        newPassword: touched.newPassword && mode === 'reset-password' && !passwordRegex.test(newPassword)
            ? 'Password must be at least 8 characters, including uppercase, lowercase and number'
            : '',
        confirmPassword: touched.confirmPassword && mode === 'reset-password' && newPassword !== confirmPassword
            ? 'Passwords do not match'
            : ''
    }

    const handleBlur = (field: keyof typeof touched) => {
        setTouched(prev => ({ ...prev, [field]: true }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const otpCode = otp.join('')
        if (otpCode.length !== 6) {
            return
        }

        try {
            if (mode === 'reset-password') {
                // Mark password fields as touched for validation
                setTouched({ newPassword: true, confirmPassword: true })

                // Validate passwords
                if (!passwordRegex.test(newPassword) || newPassword !== confirmPassword) {
                    return
                }

                await resetPassword(otpCode, newPassword)
                setSuccessMessage('Password reset successfully! You can now login with your new password.')

                // Wait 2 seconds before redirecting to login
                setTimeout(() => {
                    if (onSuccess) {
                        onSuccess()
                    } else if (onClose) {
                        onClose()
                    }
                }, 2000)
            } else {
                // Register mode
                await verifyOTP({ email, otp: otpCode })
                setSuccessMessage('Email verified successfully! You can now login.')

                // Wait 2 seconds before closing modal
                setTimeout(() => {
                    onBack()
                    if (onClose) {
                        onClose()
                    }
                    window.location.reload()
                }, 2000)
            }
        } catch (err) {
            console.error(`${mode === 'reset-password' ? 'Password reset' : 'OTP verification'} failed:`, err)
        }
    }

    return (
        <div className="auth-form">
            <button
                type="button"
                onClick={onBack}
                className="back-button"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    fontSize: '14px'
                }}
            >
                <ArrowLeft size={16} />
                {mode === 'reset-password' ? 'Back to Forgot Password' : 'Back to Register'}
            </button>

            <h2 className="auth-title">
                {mode === 'reset-password' ? 'RESET PASSWORD' : 'VERIFY EMAIL'}
            </h2>
            <p className="auth-subtitle">
                We've sent a 6-digit code to <strong>{email}</strong>
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

                {/* OTP Input Fields */}
                <div className="form-group">
                    <label className="form-label">Enter OTP Code</label>
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'center',
                        marginTop: '8px'
                    }}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="otp-input"
                                style={{
                                    width: '48px',
                                    height: '56px',
                                    textAlign: 'center',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    border: '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                required
                            />
                        ))}
                    </div>
                </div>

                {/* Password fields for reset mode */}
                {mode === 'reset-password' && (
                    <>
                        {/* New Password Field */}
                        <div className="form-group">
                            <label htmlFor="newPassword" className="form-label">New Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" />
                                <input
                                    id="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    onBlur={() => handleBlur('newPassword')}
                                    placeholder="Enter your new password"
                                    className={`form-input ${passwordErrors.newPassword ? 'input-error' : ''}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                >
                                    {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                                </button>
                            </div>
                            {passwordErrors.newPassword && (
                                <span className="field-error">{passwordErrors.newPassword}</span>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" />
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onBlur={() => handleBlur('confirmPassword')}
                                    placeholder="Confirm your new password"
                                    className={`form-input ${passwordErrors.confirmPassword ? 'input-error' : ''}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="password-toggle"
                                >
                                    {showConfirmPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                                </button>
                            </div>
                            {passwordErrors.confirmPassword && (
                                <span className="field-error">{passwordErrors.confirmPassword}</span>
                            )}
                        </div>
                    </>
                )}

                {/* Resend Code */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '16px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px'
                }}>
                    Didn't receive the code?{' '}
                    <button
                        type="button"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#3b82f6',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                        onClick={() => alert('Resend functionality to be implemented')}
                    >
                        Resend
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="submit-button"
                    disabled={
                        loading ||
                        otp.join('').length !== 6 ||
                        (mode === 'reset-password' && (!passwordRegex.test(newPassword) || newPassword !== confirmPassword))
                    }
                >
                    {loading ?
                        (mode === 'reset-password' ? 'Resetting password...' : 'Verifying...') :
                        (mode === 'reset-password' ? 'Reset Password' : 'Verify Email')
                    }
                </button>

                {/* Help Text */}
                <p style={{
                    textAlign: 'center',
                    marginTop: '16px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '13px'
                }}>
                    <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Check your spam folder if you don't see the email
                </p>
            </form>
        </div>
    )
}

export default OTPForm

import { useState } from 'react'
import { Lock, Eye, EyeOff, Hash } from 'lucide-react'
import { authService } from '@/services/auth/authService'
import { getUserFriendlyErrorMessage, parseApiError } from '@/core/api/utils/errors'
import '@/styles/AuthModal.css'

interface ResetPasswordFormProps {
    email: string
    onBackToForgotPassword: () => void
    onSuccess: () => void
}

export const ResetPasswordForm = ({ email, onBackToForgotPassword, onSuccess }: ResetPasswordFormProps) => {
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [touched, setTouched] = useState({
        otp: false,
        newPassword: false,
        confirmPassword: false
    })

    // Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    const otpRegex = /^\d{6}$/

    const errors = {
        otp: touched.otp && !otpRegex.test(otp) ? 'OTP phải là 6 chữ số' : '',
        newPassword: touched.newPassword && !passwordRegex.test(newPassword)
            ? 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số'
            : '',
        confirmPassword: touched.confirmPassword && newPassword !== confirmPassword
            ? 'Mật khẩu xác nhận không khớp'
            : ''
    }

    const isFormValid = otpRegex.test(otp) && passwordRegex.test(newPassword) && newPassword === confirmPassword

    const handleBlur = (field: keyof typeof touched) => {
        setTouched(prev => ({ ...prev, [field]: true }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Mark all fields as touched
        setTouched({ otp: true, newPassword: true, confirmPassword: true })

        if (!isFormValid) return

        try {
            setLoading(true)
            // Combine OTP and email as token for backend
            await authService.resetPassword({
                token: otp, // Backend expects OTP as token
                newPassword
            })

            // Success - redirect to login
            onSuccess()
        } catch (err) {
            const parsedError = parseApiError(err)
            const message = getUserFriendlyErrorMessage(parsedError)
            setError(message)
            console.error('Reset password failed:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-form">
            <h2 className="auth-title">Đặt Lại Mật Khẩu</h2>
            <p className="auth-subtitle">
                Mã OTP đã được gửi đến {email}
            </p>

            <form onSubmit={handleSubmit} className="form-container">
                {/* Error Message */}
                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {/* OTP Field */}
                <div className="form-group">
                    <label htmlFor="otp" className="form-label">Mã OTP</label>
                    <div className="input-wrapper">
                        <Hash className="input-icon" />
                        <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            onBlur={() => handleBlur('otp')}
                            placeholder="Nhập 6 chữ số"
                            className={`form-input ${errors.otp ? 'input-error' : ''}`}
                            maxLength={6}
                            required
                            autoFocus
                        />
                    </div>
                    {errors.otp && (
                        <span className="field-error">{errors.otp}</span>
                    )}
                </div>

                {/* New Password Field */}
                <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">Mật Khẩu Mới</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" />
                        <input
                            id="newPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onBlur={() => handleBlur('newPassword')}
                            placeholder="Nhập mật khẩu mới"
                            className={`form-input ${errors.newPassword ? 'input-error' : ''}`}
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
                    {errors.newPassword && (
                        <span className="field-error">{errors.newPassword}</span>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Xác Nhận Mật Khẩu</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" />
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={() => handleBlur('confirmPassword')}
                            placeholder="Nhập lại mật khẩu mới"
                            className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
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
                    {errors.confirmPassword && (
                        <span className="field-error">{errors.confirmPassword}</span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`submit-button ${!isFormValid && !loading ? 'button-disabled' : ''}`}
                    disabled={loading || !isFormValid}
                >
                    {loading ? 'Đang đặt lại mật khẩu...' : 'Đặt Lại Mật Khẩu'}
                </button>

                {/* Back to Forgot Password */}
                <p className="switch-text">
                    Chưa nhận được mã?{' '}
                    <button type="button" onClick={onBackToForgotPassword} className="switch-link">
                        Gửi lại
                    </button>
                </p>
            </form>
        </div>
    )
}

export default ResetPasswordForm

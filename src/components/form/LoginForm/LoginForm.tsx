import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import '@/styles/AuthModal.css'

interface LoginFormProps {
    onSwitchToRegister: () => void
    onSwitchToForgotPassword: () => void
    onClose: () => void
}

export const LoginForm = ({ onSwitchToRegister, onSwitchToForgotPassword, onClose }: LoginFormProps) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [touched, setTouched] = useState({ identifier: false, password: false })
    const { login, loading, error } = useAuth()

    // Validation
    const errors = {
        identifier: touched.identifier && !identifier ? 'Email or username is required' : '',
        password: touched.password && password.length < 6 ? 'Password must be at least 6 characters' : ''
    }

    const isFormValid = identifier.trim() !== '' && password.length >= 6

    const handleBlur = (field: 'identifier' | 'password') => {
        setTouched(prev => ({ ...prev, [field]: true }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Mark all fields as touched
        setTouched({ identifier: true, password: true })

        if (!isFormValid) return

        try {
            await login({ identifier, password, rememberMe })
            // Login successful - close modal and redirect
            onClose()

            // Get the page user was trying to access before being redirected to login
            const from = (location.state as any)?.from?.pathname || '/home'

            // Use navigate with replace to prevent going back to login
            navigate(from, { replace: true })
        } catch (err) {
            // Error is handled by useAuth hook
            console.error('Login failed:', err)
        }
    }

    return (
        <div className="auth-form">
            <h2 className="auth-title">GENZMOBO LOGIN</h2>
            <p className="auth-subtitle">Login to continue exploring your favorite Movie and Book</p>

            <form onSubmit={handleSubmit} className="form-container">
                {/* Email or Username Field */}
                <div className="form-group">
                    <label htmlFor="identifier" className="form-label">Email or Username</label>
                    <div className="input-wrapper">
                        <Mail className="input-icon" />
                        <input
                            id="identifier"
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            onBlur={() => handleBlur('identifier')}
                            placeholder="Enter your email or username"
                            className={`form-input ${errors.identifier ? 'input-error' : ''}`}
                            required
                        />
                    </div>
                    {errors.identifier && (
                        <span className="field-error">{errors.identifier}</span>
                    )}
                </div>

                {/* Password Field */}
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" />
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => handleBlur('password')}
                            placeholder="Enter your password"
                            className={`form-input ${errors.password ? 'input-error' : ''}`}
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
                    {errors.password && (
                        <span className="field-error">{errors.password}</span>
                    )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="form-options">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="checkbox-input"
                        />
                        <span>Remember me</span>
                    </label>
                    <button
                        type="button"
                        className="forgot-link"
                        onClick={onSwitchToForgotPassword}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                        Forgot password?
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
                    className={`submit-button ${!isFormValid && !loading ? 'button-disabled' : ''}`}
                    disabled={loading || !isFormValid}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                {/* Switch to Register */}
                <p className="switch-text">
                    Don't have an account?{' '}
                    <button type="button" onClick={onSwitchToRegister} className="switch-link">
                        Register now
                    </button>
                </p>
            </form>
        </div>
    )
}

export default LoginForm
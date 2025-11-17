import { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import '@/styles/AuthModal.css'

interface RegisterFormProps {
    onSwitchToLogin: () => void
    onClose: () => void
    onSuccessRegistration?: (email: string) => void
}

export const RegisterForm = ({ onSwitchToLogin, onClose, onSuccessRegistration }: RegisterFormProps) => {
    const [username, setUsername] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [validationError, setValidationError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [touched, setTouched] = useState({
        username: false,
        displayName: false,
        email: false,
        password: false,
        confirmPassword: false
    })
    const { register, loading, error } = useAuth()

    // Validation rules
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/

    const errors = {
        username: touched.username && !usernameRegex.test(username)
            ? 'Username must be 3-20 characters, only letters, numbers, and underscores'
            : '',
        displayName: touched.displayName && (displayName.length < 2 || displayName.length > 50)
            ? 'Display name must be 2-50 characters'
            : '',
        email: touched.email && !emailRegex.test(email)
            ? 'Please enter a valid email address (example@domain.com)'
            : '',
        password: touched.password && !passwordRegex.test(password)
            ? 'Password must be 8+ characters with uppercase, lowercase, number and special character (@$!%*?&)'
            : '',
        confirmPassword: touched.confirmPassword && password !== confirmPassword
            ? 'Passwords do not match. Please enter the same password'
            : ''
    }

    const isFormValid =
        usernameRegex.test(username) &&
        displayName.length >= 2 &&
        displayName.length <= 50 &&
        emailRegex.test(email) &&
        passwordRegex.test(password) &&
        password === confirmPassword &&
        agreeTerms

    const handleBlur = (field: keyof typeof touched) => {
        setTouched(prev => ({ ...prev, [field]: true }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setValidationError('')
        setSuccessMessage('')

        // Mark all fields as touched
        setTouched({
            username: true,
            displayName: true,
            email: true,
            password: true,
            confirmPassword: true
        })

        if (!isFormValid) {
            // Show specific validation error
            if (!usernameRegex.test(username)) {
                setValidationError('Invalid username format')
            } else if (displayName.length < 2 || displayName.length > 50) {
                setValidationError('Invalid display name length')
            } else if (!emailRegex.test(email)) {
                setValidationError('Invalid email format')
            } else if (!passwordRegex.test(password)) {
                setValidationError('Password does not meet requirements')
            } else if (password !== confirmPassword) {
                setValidationError('Passwords do not match')
            } else if (!agreeTerms) {
                setValidationError('Please accept the Terms and Conditions')
            } else {
                setValidationError('Please fill all fields correctly')
            }
            return
        }

        try {
            const response = await register({
                username,
                email,
                password,
                displayName,
                acceptTerms: agreeTerms
            })
            // Registration successful - show message and switch to OTP verification
            setSuccessMessage(response.message || 'Registration successful! Please check your email for OTP.')

            // Notify parent to switch to OTP verification
            if (onSuccessRegistration) {
                onSuccessRegistration(email)
            }
        } catch (err) {
            // Error is handled by useAuth hook
            console.error('Registration failed:', err)
        }
    }

    return (
        <div className="auth-form">
            <h2 className="auth-title">CREATE ACCOUNT</h2>
            <p className="auth-subtitle">Join us to explore amazing Movie and Book content</p>

            <form onSubmit={handleSubmit} className="form-container">
                {/* Username Field */}
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username</label>
                    <div className="input-wrapper">
                        <User className="input-icon" />
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onBlur={() => handleBlur('username')}
                            placeholder="Choose a username"
                            className={`form-input ${errors.username ? 'input-error' : ''}`}
                            required
                        />
                    </div>
                    {errors.username && (
                        <span className="field-error">{errors.username}</span>
                    )}
                </div>

                {/* Display Name Field */}
                <div className="form-group">
                    <label htmlFor="displayName" className="form-label">Display Name</label>
                    <div className="input-wrapper">
                        <User className="input-icon" />
                        <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            onBlur={() => handleBlur('displayName')}
                            placeholder="Enter your display name"
                            className={`form-input ${errors.displayName ? 'input-error' : ''}`}
                            required
                        />
                    </div>
                    {errors.displayName && (
                        <span className="field-error">{errors.displayName}</span>
                    )}
                </div>

                {/* Email Field */}
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <div className="input-wrapper">
                        <Mail className="input-icon" />
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => handleBlur('email')}
                            placeholder="Enter your email"
                            className={`form-input ${errors.email ? 'input-error' : ''}`}
                            required
                        />
                    </div>
                    {errors.email && (
                        <span className="field-error">{errors.email}</span>
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
                            placeholder="Create a password"
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
                            placeholder="Confirm your password"
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

                {/* Terms Agreement */}
                <div className="form-options">
                    <label className="checkbox-label" style={{
                        border: validationError === 'Please accept the Terms and Conditions' ? '1px solid #ff4444' : 'none',
                        padding: validationError === 'Please accept the Terms and Conditions' ? '8px' : '0',
                        borderRadius: '6px',
                        backgroundColor: validationError === 'Please accept the Terms and Conditions' ? 'rgba(255, 68, 68, 0.05)' : 'transparent'
                    }}>
                        <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => {
                                setAgreeTerms(e.target.checked)
                                if (e.target.checked) {
                                    setValidationError('')
                                }
                            }}
                            className="checkbox-input"
                            required
                        />
                        <span>
                            I agree to the{' '}
                            <a href="/terms" className="terms-link" onClick={(e) => e.stopPropagation()}>
                                Terms and Conditions
                            </a>
                        </span>
                    </label>
                </div>
                {validationError === 'Please accept the Terms and Conditions' && (
                    <span className="field-error" style={{ marginTop: '4px', display: 'block' }}>
                        {validationError}
                    </span>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="form-success" style={{
                        padding: '12px',
                        marginBottom: '16px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '14px'
                    }}>
                        {successMessage}
                    </div>
                )}

                {/* Error Messages */}
                {(error || validationError) && (
                    <div className="form-error">
                        {validationError || error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`submit-button ${!isFormValid && !loading ? 'button-disabled' : ''}`}
                    disabled={loading || !isFormValid}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                {/* Switch to Login */}
                <p className="switch-text">
                    Already have an account?{' '}
                    <button type="button" onClick={onSwitchToLogin} className="switch-link">
                        Login here
                    </button>
                </p>
            </form>
        </div>
    )
}

export default RegisterForm
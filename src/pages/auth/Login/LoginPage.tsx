import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { useAuth } from '@/hooks/useAuth'
import '@/styles/AuthModal.css'

const LoginPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { login, loading, error, clearError } = useAuth()

	const [formData, setFormData] = useState({
		identifier: '', // email or username
		password: '',
		rememberMe: false
	})

	const [showPassword, setShowPassword] = useState(false)
	const [validationErrors, setValidationErrors] = useState<{
		identifier?: string
		password?: string
	}>({})

	// Get the page user was trying to access before login
	const from = (location.state as any)?.from?.pathname || '/home'

	const validateForm = () => {
		const errors: typeof validationErrors = {}

		if (!formData.identifier.trim()) {
			errors.identifier = 'Email or username is required'
		}

		if (!formData.password) {
			errors.password = 'Password is required'
		} else if (formData.password.length < 6) {
			errors.password = 'Password must be at least 6 characters'
		}

		setValidationErrors(errors)
		return Object.keys(errors).length === 0
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		clearError()

		if (!validateForm()) {
			return
		}

		try {
			await login({
				identifier: formData.identifier,
				password: formData.password,
				rememberMe: formData.rememberMe
			})

			// Redirect to the page user was trying to access, or home
			navigate(from, { replace: true })
		} catch (err) {
			// Error is already handled by useAuth hook
			console.error('Login failed:', err)
		}
	}

	const handleChange = (field: string, value: string | boolean) => {
		setFormData(prev => ({ ...prev, [field]: value }))
		// Clear validation error for this field
		if (validationErrors[field as keyof typeof validationErrors]) {
			setValidationErrors(prev => ({ ...prev, [field]: undefined }))
		}
		// Clear global error
		if (error) {
			clearError()
		}
	}

	return (
		<Layout showHeader={false} showFooter={false}>
			<div className="auth-page">
				<div className="auth-container">
					<div className="auth-header">
						<h1 className="auth-title">Welcome Back</h1>
						<p className="auth-subtitle">Sign in to continue to GENZMOBO</p>
					</div>

					<form onSubmit={handleSubmit} className="auth-form">
						{/* Global Error Message */}
						{error && (
							<div className="auth-error-banner">
								<span className="error-icon">⚠</span>
								<span>{error}</span>
							</div>
						)}

						{/* Email/Username Input */}
						<div className="form-group">
							<label htmlFor="identifier" className="form-label">
								Email or Username
							</label>
							<input
								id="identifier"
								type="text"
								className={`form-input ${validationErrors.identifier ? 'input-error' : ''}`}
								placeholder="Enter your email or username"
								value={formData.identifier}
								onChange={(e) => handleChange('identifier', e.target.value)}
								disabled={loading}
							/>
							{validationErrors.identifier && (
								<span className="error-message">{validationErrors.identifier}</span>
							)}
						</div>

						{/* Password Input */}
						<div className="form-group">
							<label htmlFor="password" className="form-label">
								Password
							</label>
							<div className="password-input-wrapper">
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									className={`form-input ${validationErrors.password ? 'input-error' : ''}`}
									placeholder="Enter your password"
									value={formData.password}
									onChange={(e) => handleChange('password', e.target.value)}
									disabled={loading}
								/>
								<button
									type="button"
									className="password-toggle"
									onClick={() => setShowPassword(!showPassword)}
									tabIndex={-1}
								>
									{showPassword ? '👁️' : '👁️‍🗨️'}
								</button>
							</div>
							{validationErrors.password && (
								<span className="error-message">{validationErrors.password}</span>
							)}
						</div>

						{/* Remember Me & Forgot Password */}
						<div className="form-options">
							<label className="checkbox-label">
								<input
									type="checkbox"
									checked={formData.rememberMe}
									onChange={(e) => handleChange('rememberMe', e.target.checked)}
									disabled={loading}
								/>
								<span>Remember me</span>
							</label>
							<Link to="/auth/forgot-password" className="forgot-password-link">
								Forgot password?
							</Link>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							className="auth-button"
							disabled={loading}
						>
							{loading ? (
								<>
									<span className="spinner"></span>
									Signing in...
								</>
							) : (
								'Sign In'
							)}
						</button>

						{/* Register Link */}
						<div className="auth-footer">
							<p>
								Don't have an account?{' '}
								<Link to="/auth/register" className="auth-link">
									Sign up
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</Layout>
	)
}

export default LoginPage

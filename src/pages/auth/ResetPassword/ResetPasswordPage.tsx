import { useState, type FormEvent, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { authService } from '@/services/auth/authService'
import { getUserFriendlyErrorMessage, parseApiError } from '@/core/api/utils/errors'
import '@/styles/AuthModal.css'

const ResetPasswordPage = () => {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const token = searchParams.get('token')

	const [formData, setFormData] = useState({
		newPassword: '',
		confirmPassword: ''
	})

	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [validationErrors, setValidationErrors] = useState<{
		newPassword?: string
		confirmPassword?: string
	}>({})
	const [successMessage, setSuccessMessage] = useState('')

	// Check if token exists
	useEffect(() => {
		if (!token) {
			setError('Invalid or missing reset token. Please request a new password reset link.')
		}
	}, [token])

	const validateForm = () => {
		const errors: typeof validationErrors = {}

		if (!formData.newPassword) {
			errors.newPassword = 'Password is required'
		} else if (formData.newPassword.length < 8) {
			errors.newPassword = 'Password must be at least 8 characters'
		} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
			errors.newPassword = 'Password must contain uppercase, lowercase, and number'
		}

		if (!formData.confirmPassword) {
			errors.confirmPassword = 'Please confirm your password'
		} else if (formData.newPassword !== formData.confirmPassword) {
			errors.confirmPassword = 'Passwords do not match'
		}

		setValidationErrors(errors)
		return Object.keys(errors).length === 0
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setError('')
		setSuccessMessage('')

		if (!token) {
			setError('Invalid reset token')
			return
		}

		if (!validateForm()) {
			return
		}

		try {
			setLoading(true)
			await authService.resetPassword({
				token,
				newPassword: formData.newPassword
			})

			setSuccessMessage('Password reset successful! Redirecting to login...')

			// Redirect to login after 2 seconds
			setTimeout(() => {
				navigate('/auth/login', { replace: true })
			}, 2000)
		} catch (err) {
			const parsedError = parseApiError(err)
			const message = getUserFriendlyErrorMessage(parsedError)
			setError(message)
			console.error('Reset password failed:', err)
		} finally {
			setLoading(false)
		}
	}

	const handleChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
		// Clear validation error for this field
		if (validationErrors[field as keyof typeof validationErrors]) {
			setValidationErrors(prev => ({ ...prev, [field]: undefined }))
		}
		// Clear global error
		if (error) {
			setError('')
		}
	}

	return (
		<Layout showHeader={false} showFooter={false}>
			<div className="auth-page">
				<div className="auth-container">
					<div className="auth-header">
						<h1 className="auth-title">Reset Password</h1>
						<p className="auth-subtitle">
							Enter your new password below
						</p>
					</div>

					<form onSubmit={handleSubmit} className="auth-form">
						{/* Success Message */}
						{successMessage && (
							<div className="auth-success-banner">
								<span className="success-icon">✓</span>
								<span>{successMessage}</span>
							</div>
						)}

						{/* Error Message */}
						{error && (
							<div className="auth-error-banner">
								<span className="error-icon">⚠</span>
								<span>{error}</span>
							</div>
						)}

						{/* New Password Input */}
						<div className="form-group">
							<label htmlFor="newPassword" className="form-label">
								New Password
							</label>
							<div className="password-input-wrapper">
								<input
									id="newPassword"
									type={showPassword ? 'text' : 'password'}
									className={`form-input ${validationErrors.newPassword ? 'input-error' : ''}`}
									placeholder="Enter new password"
									value={formData.newPassword}
									onChange={(e) => handleChange('newPassword', e.target.value)}
									disabled={loading || !token}
									autoFocus
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
							{validationErrors.newPassword && (
								<span className="error-message">{validationErrors.newPassword}</span>
							)}
							<p className="form-hint">
								Must be at least 8 characters with uppercase, lowercase, and number
							</p>
						</div>

						{/* Confirm Password Input */}
						<div className="form-group">
							<label htmlFor="confirmPassword" className="form-label">
								Confirm Password
							</label>
							<div className="password-input-wrapper">
								<input
									id="confirmPassword"
									type={showConfirmPassword ? 'text' : 'password'}
									className={`form-input ${validationErrors.confirmPassword ? 'input-error' : ''}`}
									placeholder="Re-enter new password"
									value={formData.confirmPassword}
									onChange={(e) => handleChange('confirmPassword', e.target.value)}
									disabled={loading || !token}
								/>
								<button
									type="button"
									className="password-toggle"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									tabIndex={-1}
								>
									{showConfirmPassword ? '👁️' : '👁️‍🗨️'}
								</button>
							</div>
							{validationErrors.confirmPassword && (
								<span className="error-message">{validationErrors.confirmPassword}</span>
							)}
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							className="auth-button"
							disabled={loading || !token}
						>
							{loading ? (
								<>
									<span className="spinner"></span>
									Resetting password...
								</>
							) : (
								'Reset Password'
							)}
						</button>

						{/* Back to Login Link */}
						<div className="auth-footer">
							<p>
								Remember your password?{' '}
								<Link to="/auth/login" className="auth-link">
									Sign in
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</Layout>
	)
}

export default ResetPasswordPage

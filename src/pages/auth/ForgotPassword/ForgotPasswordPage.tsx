import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { useAuth } from '@/hooks/useAuth'
import '@/styles/AuthModal.css'

const ForgotPasswordPage = () => {
	const { forgotPassword, loading, error, clearError } = useAuth()

	const [email, setEmail] = useState('')
	const [validationError, setValidationError] = useState('')
	const [successMessage, setSuccessMessage] = useState('')

	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email)
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		clearError()
		setValidationError('')
		setSuccessMessage('')

		// Validation
		if (!email.trim()) {
			setValidationError('Email is required')
			return
		}

		if (!validateEmail(email)) {
			setValidationError('Please enter a valid email address')
			return
		}

		try {
			await forgotPassword(email)
			setSuccessMessage(
				'Password reset link has been sent to your email. Please check your inbox and follow the instructions.'
			)
			setEmail('')
		} catch (err) {
			// Error is already handled by useAuth hook
			console.error('Forgot password failed:', err)
		}
	}

	const handleEmailChange = (value: string) => {
		setEmail(value)
		if (validationError) {
			setValidationError('')
		}
		if (error) {
			clearError()
		}
		if (successMessage) {
			setSuccessMessage('')
		}
	}

	return (
		<Layout showHeader={false} showFooter={false}>
			<div className="auth-page">
				<div className="auth-container">
					<div className="auth-header">
						<h1 className="auth-title">Forgot Password?</h1>
						<p className="auth-subtitle">
							Enter your email address and we'll send you a link to reset your password
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

						{/* Email Input */}
						<div className="form-group">
							<label htmlFor="email" className="form-label">
								Email Address
							</label>
							<input
								id="email"
								type="email"
								className={`form-input ${validationError ? 'input-error' : ''}`}
								placeholder="Enter your registered email"
								value={email}
								onChange={(e) => handleEmailChange(e.target.value)}
								disabled={loading}
								autoFocus
							/>
							{validationError && (
								<span className="error-message">{validationError}</span>
							)}
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
									Sending reset link...
								</>
							) : (
								'Send Reset Link'
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

export default ForgotPasswordPage

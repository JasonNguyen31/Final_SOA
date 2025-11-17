import { createPortal } from 'react-dom'
import { X, Wallet, ArrowUpRight, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { userService } from '@/services/user/userService'
import './WalletModal.css'

interface WalletModalProps {
	isOpen: boolean
	onClose: () => void
}

export const WalletModal = ({ isOpen, onClose }: WalletModalProps) => {
	const { user } = useAuth()
	const [transactions, setTransactions] = useState<any[]>([])
	const [balance, setBalance] = useState(0)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (isOpen && user?.id) {
			fetchWalletData()
		}
	}, [isOpen, user?.id])

	const fetchWalletData = async () => {
		try {
			setIsLoading(true)
			const walletData = await userService.getWallet(1, 10)
			setBalance(walletData.balance)
			setTransactions(walletData.transactions || [])
		} catch (error) {
			console.error('Failed to fetch wallet data:', error)
			// Fallback to user balance if API fails
			setBalance(user?.walletBalance || 2000000)
		} finally {
			setIsLoading(false)
		}
	}

	const handleDeposit = () => {
		alert('Deposit feature is coming soon! Stay tuned.')
	}

	const handleWithdraw = () => {
		alert('Withdraw feature is coming soon! Stay tuned.')
	}

	if (!isOpen) return null

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
	}

	const modalContent = (
		<div className="modal-overlay" onClick={onClose}>
			<div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
				<button className="modal-close-btn" onClick={onClose}>
					<X size={24} />
				</button>

				<div className="wallet-modal-content">
					{/* Wallet Header */}
					<div className="wallet-header">
						<div className="wallet-icon-wrapper">
							<Wallet size={40} className="wallet-icon" />
						</div>
						<h2 className="wallet-title">My Wallet</h2>
					</div>

					{/* Balance Card */}
					<div className="wallet-balance-card">
						<div className="balance-label">Available Balance</div>
						<div className="balance-amount">{formatCurrency(balance)}</div>
						<div className="balance-actions">
							<button className="balance-action-btn deposit" onClick={handleDeposit}>
								<Plus size={18} />
								Deposit
							</button>
							<button className="balance-action-btn withdraw" onClick={handleWithdraw}>
								<ArrowUpRight size={18} />
								Withdraw
							</button>
						</div>
					</div>

					{/* Transaction History */}
					<div className="wallet-transactions">
						<h3 className="transactions-title">Recent Transactions</h3>
						<div className="transactions-list">
							{transactions.length > 0 ? (
								transactions.slice(0, 5).map((transaction) => (
									<div key={transaction.id} className="transaction-item">
										<div className="transaction-icon premium">
											<ArrowUpRight size={20} />
										</div>
										<div className="transaction-details">
											<div className="transaction-description">{transaction.description}</div>
											<div className="transaction-date">
												{new Date(transaction.createdAt).toLocaleDateString('vi-VN')}
											</div>
										</div>
										<div className="transaction-amount withdrawal">
											-{formatCurrency(transaction.amount)}
										</div>
									</div>
								))
							) : (
								<div className="no-transactions">
									<p>No transactions yet</p>
								</div>
							)}
						</div>
					</div>

					{/* View All Button */}
					<button className="btn-view-all" onClick={() => {
						onClose()
						window.location.href = '/wallet/history'
					}}>
						View All Transactions
					</button>
				</div>
			</div>
		</div>
	)

	return createPortal(modalContent, document.body)
}

export default WalletModal

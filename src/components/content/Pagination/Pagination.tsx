interface PaginationProps {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
	const renderPagination = () => {
		const pages = []

		// First page button
		pages.push(
			<button
				key="first"
				onClick={() => onPageChange(1)}
				disabled={currentPage === 1}
				className="pagination-button"
			>
				First
			</button>
		)

		// Previous button
		pages.push(
			<button
				key="prev"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="pagination-button"
			>
				&lt;
			</button>
		)

		// Page numbers
		if (currentPage > 2) {
			pages.push(<span key="dots1" className="pagination-dots">...</span>)
		}

		for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
			pages.push(
				<button
					key={i}
					onClick={() => onPageChange(i)}
					className={`pagination-button ${currentPage === i ? 'active' : ''}`}
				>
					{i}
				</button>
			)
		}

		if (currentPage < totalPages - 1) {
			pages.push(<span key="dots2" className="pagination-dots">...</span>)
		}

		// Next button
		pages.push(
			<button
				key="next"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="pagination-button"
			>
				&gt;
			</button>
		)

		// Last page button
		pages.push(
			<button
				key="last"
				onClick={() => onPageChange(totalPages)}
				disabled={currentPage === totalPages}
				className="pagination-button"
			>
				Last
			</button>
		)

		return pages
	}

	return (
		<div className="content-pagination">
			{renderPagination()}
		</div>
	)
}

export default Pagination

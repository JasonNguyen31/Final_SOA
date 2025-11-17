interface ContentFiltersProps {
	activeTab: 'movies' | 'anime' | 'books'
	onTabChange: (tab: 'movies' | 'anime' | 'books') => void
}

export const ContentFilters: React.FC<ContentFiltersProps> = ({ activeTab, onTabChange }) => {
	return (
		<div className="content-header">
			<div className="content-tabs">
				<button
					onClick={() => onTabChange('movies')}
					className={`content-tab ${activeTab === 'movies' ? 'active' : ''}`}
				>
					Movies
				</button>
				<span className="tab-divider">|</span>
				<button
					onClick={() => onTabChange('anime')}
					className={`content-tab ${activeTab === 'anime' ? 'active' : ''}`}
				>
					Anime
				</button>
				<span className="tab-divider">|</span>
				<button
					onClick={() => onTabChange('books')}
					className={`content-tab ${activeTab === 'books' ? 'active' : ''}`}
				>
					Books
				</button>
			</div>
		</div>
	)
}

export default ContentFilters

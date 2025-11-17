import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { movieService, type Movie } from '@/services/content/movieService'
import '@/styles/SearchBox.css'

interface SearchBoxProps {
    placeholder?: string
    className?: string
}

export const SearchBox = ({ placeholder = 'Search for your fave anime', className = '' }: SearchBoxProps) => {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Movie[]>([])
    const [loading, setLoading] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    // Debounce search
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([])
            setShowDropdown(false)
            return
        }

        const timer = setTimeout(async () => {
            try {
                setLoading(true)
                const response = await movieService.searchMovies(query, 1, 5)
                console.log('Search response:', response)
                console.log('Movies:', response.movies)
                setResults(response.movies)
                setShowDropdown(true)
            } catch (error) {
                console.error('Search error:', error)
                setResults([])
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleResultClick = (movieId: string) => {
        navigate(`/movies/${movieId}`)
        setQuery('')
        setShowDropdown(false)
    }


    return (
        <div ref={searchRef} className={`search-box-container ${className}`}>
            <div className="search-input-wrapper">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (results.length > 0) setShowDropdown(true)
                    }}
                    placeholder={placeholder}
                    className="search-input"
                />
                
                <Search className="search-icon" />
            </div>

            {showDropdown && (
                <div className="search-dropdown">
                    {loading ? (
                        <div className="search-dropdown-loading">Searching...</div>
                    ) : results.length > 0 ? (
                        <>
                            {results.map((movie) => (
                                <button
                                    key={movie.id}
                                    onClick={() => handleResultClick(movie.id)}
                                    className="search-result-item"
                                >
                                    <img
                                        src={movie.thumbnailUrl || '/placeholder.jpg'}
                                        alt={movie.title}
                                        className="search-result-image"
                                    />
                                    <div className="search-result-info">
                                        <h4 className="search-result-title">{movie.title}</h4>
                                        <p className="search-result-meta">
                                            {movie.releaseYear} • {movie.genres?.slice(0, 2).join(', ')}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </>
                    ) : (
                        <div className="search-dropdown-empty">
                            Không tìm thấy phim "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SearchBox

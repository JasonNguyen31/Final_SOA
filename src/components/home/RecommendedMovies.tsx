import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { movieService, type Movie } from '@/services/content/movieService'
import '@/styles/RecommendedMovies.css'

interface RecommendedMoviesProps {
    currentMovieId: string | number
    currentMovieTitle?: string
    currentMovieGenres?: string[]
}

export const RecommendedMovies = ({
    currentMovieId,
    currentMovieTitle = 'this movie',
    currentMovieGenres = []
}: RecommendedMoviesProps) => {
    const [relatedMovies, setRelatedMovies] = useState<Movie[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecommendedMovies = async () => {
            try {
                setLoading(true)

                // Convert currentMovieId to string for comparison
                const currentIdStr = String(currentMovieId).trim()

                // Fetch movies with same genre (for "Because You Watch")
                // Similar content based on genre
                if (currentMovieGenres.length > 0) {
                    const relatedData = await movieService.getMovies({
                        genre: currentMovieGenres[0],
                        limit: 10,
                        page: 1
                    })
                    // Filter out current movie - compare as strings
                    const filtered = relatedData.movies.filter((m: Movie) => {
                        const movieIdStr = String(m.id).trim()
                        return movieIdStr !== currentIdStr
                    })
                    setRelatedMovies(filtered.slice(0, 5))
                }
            } catch (error) {
                console.error('Error fetching recommended movies:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchRecommendedMovies()
    }, [currentMovieId, currentMovieGenres])

    if (loading) {
        return (
            <section className="recommended-section">
                <div className="recommended-container">
                    <div className="recommended-block">
                        <p style={{ color: '#fff', textAlign: 'center' }}>Loading recommendations...</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="recommended-section">
            <div className="recommended-container">
                {/* Because You Watch */}
                {relatedMovies.length > 0 && (
                    <div className="recommended-block">
                        <h2 className="recommended-title">
                            <span className="title-highlight">Because You Watch</span> {currentMovieTitle}
                        </h2>
                        <div className="movies-grid">
                            {relatedMovies.map((movie) => (
                                <Link key={movie.id} to={`/movies/${movie.id}`} className="movie-card-small">
                                    <div className="movie-poster-small">
                                        <img src={movie.thumbnailUrl || ''} alt={movie.title} />
                                        <span className="movie-year-badge">{movie.releaseYear || 2024}</span>
                                    </div>
                                    <h3 className="movie-title-small">{movie.title}</h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default RecommendedMovies
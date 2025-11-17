import { Search, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import '@/styles/GuestHeader.css'
import logoCoverImage from '@/assets/images/header-logo.jpg'

interface GuestHeaderProps {
    onLogin: () => void
    onRegister: () => void
}

export const GuestHeader = ({ onLogin, onRegister }: GuestHeaderProps) => {
    const [showMoviesMenu, setShowMoviesMenu] = useState(false)
    const [showBooksMenu, setShowBooksMenu] = useState(false)
    const [hoverMovies, setHoverMovies] = useState(false)
    const [hoverBooks, setHoverBooks] = useState(false)
    const [moviesClickLocked, setMoviesClickLocked] = useState(false)
    const [booksClickLocked, setBooksClickLocked] = useState(false)

    // Handle clicks outside dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            
            if (!target.closest('.nav-dropdown')) {
                if (moviesClickLocked) {
                    setShowMoviesMenu(false)
                    setMoviesClickLocked(false)
                }
                if (booksClickLocked) {
                    setShowBooksMenu(false)
                    setBooksClickLocked(false)
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [moviesClickLocked, booksClickLocked])

    return (
        <header className="guest-header">
            <div className="guest-header-container">
                <div className="guest-header-content">
                    {/* Left Section - Logo with Background */}
                    <div className="guest-header-left">
                        <div className="guest-logo-wrapper">
                            <a href="/" className="guest-logo">
                                <div className="guest-logo-text-group">
                                    <div className="guest-logo-main">
                                        <span className="guest-logo-text">GENZ</span>
                                        <span className="guest-logo-network">MOBO</span>
                                    </div>
                                    <span className="guest-logo-japanese">映画と本の閲覧ウェブサイト</span>
                                </div>
                            </a>
                            <div className="guest-logo-background">
                                <img src={logoCoverImage} alt="background" />
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Navigation & Auth Buttons */}
                    <div className="guest-header-right">
                        {/* Main Navigation */}
                        <nav className="guest-main-nav">
                            <a href="/" className="guest-nav-link active">
                                <strong> Home </strong>
                            </a>

                            <div
                                className="guest-nav-dropdown"
                                onMouseEnter={() => {
                                    if (!moviesClickLocked) {
                                        setShowMoviesMenu(true)
                                        setShowBooksMenu(false)
                                        setBooksClickLocked(false)
                                    }
                                    setHoverMovies(true)
                                }}
                                onMouseLeave={() => {
                                    if (!moviesClickLocked) {
                                        setShowMoviesMenu(false)
                                    }
                                    setHoverMovies(false)
                                }}
                            >
                                <button 
                                    className={`nav-link ${hoverMovies || showMoviesMenu ? 'hovered' : ''}`}
                                    onClick={() => {
                                        if (moviesClickLocked) {
                                            setShowMoviesMenu(false)
                                            setMoviesClickLocked(false)
                                        } else {
                                            setShowMoviesMenu(true)
                                            setMoviesClickLocked(true)
                                            setShowBooksMenu(false)
                                            setBooksClickLocked(false)
                                        }
                                    }}
                                >
                                    <strong> Movies </strong>
                                    <ChevronDown className="guest-nav-icon" />
                                </button>
                                {showMoviesMenu && (
                                    <div className="guest-dropdown-menu">
                                        <a href="/movies/action" className="guest-dropdown-item">Action</a>
                                        <a href="/movies/comedy" className="guest-dropdown-item">Comedy</a>
                                        <a href="/movies/drama" className="guest-dropdown-item">Drama</a>
                                        <a href="/movies/romance" className="guest-dropdown-item">Romance</a>
                                    </div>
                                )}
                            </div>

                            <div
                                className="guest-nav-dropdown"
                                onMouseEnter={() => {
                                    if (!booksClickLocked) {
                                        setShowBooksMenu(true)
                                        setShowMoviesMenu(false)
                                        setMoviesClickLocked(false)
                                    }
                                    setHoverBooks(true)
                                }}
                                onMouseLeave={() => {
                                    if (!booksClickLocked) {
                                        setShowBooksMenu(false)
                                    }
                                    setHoverBooks(false)
                                }}
                            >
                                <button 
                                    className={`nav-link ${hoverBooks || showBooksMenu ? 'hovered' : ''}`}
                                    onClick={() => {
                                        if (booksClickLocked) {
                                            setShowBooksMenu(false)
                                            setBooksClickLocked(false)
                                        } else {
                                            setShowBooksMenu(true)
                                            setBooksClickLocked(true)
                                            setShowMoviesMenu(false)
                                            setMoviesClickLocked(false)
                                        }
                                    }}
                                >
                                    <strong> Books </strong>
                                    <ChevronDown className="guest-nav-icon" />
                                </button>
                                {showBooksMenu && (
                                    <div className="guest-dropdown-menu">
                                        <a href="/books/manga" className="guest-dropdown-item">Manga</a>
                                        <a href="/books/light-novel" className="guest-dropdown-item">Light Novel</a>
                                        <a href="/books/artbook" className="guest-dropdown-item">Artbook</a>
                                    </div>
                                )}
                            </div>

                            <a href="/news" className="guest-nav-link">
                                <strong> News </strong>
                            </a>
                        </nav>

                        {/* Search Bar */}
                        <div className="guest-search-box">
                            <input
                                type="text"
                                placeholder="Search for your fave anime"
                                className="guest-search-input"
                            />
                            <Search className="guest-search-icon" />
                        </div>

                        {/* Auth Buttons */}
                        <div className="guest-auth-buttons">
                            <button onClick={onLogin} className="guest-btn-login">
                                Login
                            </button>
                            <button onClick={onRegister} className="guest-btn-register">
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default GuestHeader
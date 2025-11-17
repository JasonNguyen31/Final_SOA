import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GuestHeader } from '@/components/home/GuestHeader'
import { HeroBanner } from '@/components/home/HeroBanner'
import { ContentGrid } from '@/components/content/ContentGrid/ContentGrid'
import { Footer } from '@/components/layout/Footer/Footer'
import { useAuth } from '@/context/AuthContext'
import { useAuthModal } from '@/context/AuthModalContext'
import { usePageTitle } from '@/hooks/usePageTitle'

export const LandingPage = () => {
    usePageTitle('Home - Entertainment Platform')
    const { isAuthenticated } = useAuth()
    const { openLogin, openRegister } = useAuthModal()
    const navigate = useNavigate()

    // Redirect authenticated users to home page
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home', { replace: true })
        }
    }, [isAuthenticated, navigate])

    return (
        <div className="landing-page">
            <GuestHeader onLogin={openLogin} onRegister={openRegister} />
            <HeroBanner />
            <ContentGrid />
            <Footer />
        </div>
    )
}

export default LandingPage
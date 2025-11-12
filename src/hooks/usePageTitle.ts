import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const usePageTitle = () => {
    const location = useLocation()

    useEffect(() => {
        const pathToTitle: Record<string, string> = {
            '/': 'Home',
            '/movies': 'Movies',
            '/books': 'Books',
            '/news': 'News',
            '/movies/action': 'Action Movies',
            '/movies/comedy': 'Comedy Movies',
            '/movies/drama': 'Drama Movies',
            '/movies/romance': 'Romance Movies',
            '/books/manga': 'Manga',
            '/books/light-novel': 'Light Novel',
            '/books/artbook': 'Artbook',
        }

        const title = pathToTitle[location.pathname] || 'GENZMOBO'
        document.title = `${title} | GENZMOBO`
    }, [location])
}
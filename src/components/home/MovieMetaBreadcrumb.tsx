import { Link } from 'react-router-dom'
import { Home, ChevronRight } from 'lucide-react'

interface Breadcrumb {
    label: string
    url: string
}

interface MovieMetaBreadcrumbProps {
    breadcrumbs: Breadcrumb[]
}

export const MovieMetaBreadcrumb = ({ breadcrumbs }: MovieMetaBreadcrumbProps) => {
    return (
        <div className="breadcrumb-wrapper">
            <div className="breadcrumb-container">
                <nav className="breadcrumb-nav">
                    <Link to="/" className="breadcrumb-home">
                        <Home className="breadcrumb-icon" />
                    </Link>
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="breadcrumb-item">
                            <ChevronRight className="breadcrumb-separator" />
                            {index === breadcrumbs.length - 1 ? (
                                <span className="breadcrumb-current">{crumb.label}</span>
                            ) : (
                                <Link to={crumb.url} className="breadcrumb-link">
                                    {crumb.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    )
}

export default MovieMetaBreadcrumb
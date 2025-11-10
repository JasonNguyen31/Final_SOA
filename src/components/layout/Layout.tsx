import { type ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
	children: ReactNode
	showHeader?: boolean
	showFooter?: boolean
}

export const Layout = ({ children, showHeader = true, showFooter = true }: LayoutProps) => {
	return (
		<div className="flex min-h-screen flex-col">
			{showHeader && <Header />}
			<main className="flex-1">{children}</main>
			{showFooter && <Footer />}
		</div>
	)
}

export default Layout

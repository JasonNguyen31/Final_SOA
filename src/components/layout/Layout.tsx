import { type ReactNode } from 'react'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import '@/styles/Layout.css'

interface LayoutProps {
	children: ReactNode
	showHeader?: boolean
	showFooter?: boolean
}

export const Layout = ({ children, showHeader = true, showFooter = true }: LayoutProps) => {
	return (
		<div className="app-layout">
			{showHeader && <Header />}
			<main className="app-main">{children}</main>
			{showFooter && <Footer />}
		</div>
	)
}

export default Layout
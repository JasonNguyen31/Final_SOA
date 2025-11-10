import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
	theme: Theme
	toggleTheme: () => void
	setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within ThemeProvider')
	}
	return context
}

interface ThemeProviderProps {
	children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const [theme, setThemeState] = useState<Theme>(() => {
		// Check localStorage first
		const stored = localStorage.getItem('theme') as Theme | null
		if (stored) return stored

		// Check system preference
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark'
		}

		return 'light'
	})

	// Apply theme to document
	useEffect(() => {
		const root = document.documentElement
		root.setAttribute('data-theme', theme)
		localStorage.setItem('theme', theme)
	}, [theme])

	const toggleTheme = () => {
		setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'))
	}

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme)
	}

	const value: ThemeContextType = {
		theme,
		toggleTheme,
		setTheme,
	}

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeContext

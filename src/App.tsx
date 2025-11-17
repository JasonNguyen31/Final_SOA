import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { SearchProvider } from '@/context/SearchContext'
import { AuthModalProvider } from '@/context/AuthModalContext'
import { AppRoutes } from '@/routes/AppRoutes'
import '@/index.css'

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<SearchProvider>
					<AuthModalProvider>
						<AppRoutes />
					</AuthModalProvider>
				</SearchProvider>
			</AuthProvider>
		</BrowserRouter>
	)
}

export default App

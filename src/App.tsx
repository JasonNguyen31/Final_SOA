import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/config/queryClient'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { AppRoutes } from '@/routes/AppRoutes'

function App() {
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider>
					<NotificationProvider>
						<AuthProvider>
							<AppRoutes />
						</AuthProvider>
					</NotificationProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</BrowserRouter>
	)
}

export default App

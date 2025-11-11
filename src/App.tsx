import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { QueryClientProvider } from '@tanstack/react-query'
// import { queryClient } from '@/config/queryClient'
// import { AuthProvider } from '@/context/AuthContext'
// import { ThemeProvider } from '@/context/ThemeContext'
// import { NotificationProvider } from '@/context/NotificationContext'
// import { AppRoutes } from '@/routes/AppRoutes'
import HomePage from '@/pages/user/Home/HomePage'
import '@/index.css'

function App() {
	return (
		// <BrowserRouter>
		// 	<QueryClientProvider client={queryClient}>
		// 		<ThemeProvider>
		// 			<NotificationProvider>
		// 				<AuthProvider>
		// 					<AppRoutes />
		// 				</AuthProvider>
		// 			</NotificationProvider>
		// 		</ThemeProvider>
		// 	</QueryClientProvider>
		// </BrowserRouter>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App

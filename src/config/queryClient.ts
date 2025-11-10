import { QueryClient } from '@tanstack/react-query'

// Configure React Query
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Stale time - data is considered fresh for 5 minutes
			staleTime: 5 * 60 * 1000,
			// Cache time - unused data stays in cache for 10 minutes
			gcTime: 10 * 60 * 1000,
			// Retry failed requests
			retry: 1,
			// Refetch on window focus
			refetchOnWindowFocus: false,
			// Refetch on reconnect
			refetchOnReconnect: true,
		},
		mutations: {
			// Retry failed mutations
			retry: 0,
		},
	},
})

export default queryClient

import { QueryClient } from "@tanstack/react-query";

const DEFAULT_QUERY_STALE_TIME_IN_MS = 5 * 60 * 1000;
const DEFAULT_QUERY_GC_TIME_IN_MS = 30 * 60 * 1000;
const DEFAULT_QUERY_RETRY_COUNT = 2;

export function createAppQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: {
			queries: {
				gcTime: DEFAULT_QUERY_GC_TIME_IN_MS,
				retry: DEFAULT_QUERY_RETRY_COUNT,
				staleTime: DEFAULT_QUERY_STALE_TIME_IN_MS,
				refetchOnWindowFocus: false,
			},
		},
	});
}

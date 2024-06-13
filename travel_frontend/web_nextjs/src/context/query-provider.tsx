'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // reretching time setting
        retry: 3, // 재시도 횟수를 3로 설정
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000), // 재시도 간격을 5초로 설정
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
        gcTime: (24 * 60 * 60 * 1000) + 5000,
        refetchOnWindowFocus: false, // 윈도우 포커스 시 리페치 안 함
        refetchOnReconnect: false, // 재연결 시 항상 리페치하지 않음
        refetchInterval: false, // 정기적으로 리페치하지 않음
      },
    },
  });
}
let browserQueryClient: QueryClient | undefined = undefined;

// Server: 항상 새로운 쿼리 생성
// Browser: 클라이언트가 없으면 새 쿼리 생성
function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {

  const queryClient = getQueryClient();
  // const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {children}
      </ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>);
}
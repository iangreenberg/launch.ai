import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Helper to determine if we need to use an absolute URL for API requests
function getFullApiUrl(path: string): string {
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Ensure path starts with a slash
  const apiPath = path.startsWith('/') ? path : `/${path}`;
  
  // Check if we're in a Vercel environment
  const vercelUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : '';
    
  // In production on Vercel, use the deployment URL as base
  if (vercelUrl && !vercelUrl.includes('localhost')) {
    return `${vercelUrl}${apiPath}`;
  }
  
  // In development, use relative path
  return apiPath;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Get the full URL if needed
  const apiUrl = getFullApiUrl(url);
  
  // Log in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`API Request: ${method} ${apiUrl}`);
  }
  
  const res = await fetch(apiUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get the full URL if needed
    const apiUrl = getFullApiUrl(queryKey[0] as string);
    
    // Log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Query Request: GET ${apiUrl}`);
    }
    
    const res = await fetch(apiUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

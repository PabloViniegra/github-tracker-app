/**
 * API utility functions for GitHub Activity Tracker
 * Base URL: http://localhost:8000/api/v1
 */

import { GitHubEventsResponse } from '@/types/github';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Token storage utilities
 */
export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasTokens: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!(localStorage.getItem(ACCESS_TOKEN_KEY) && localStorage.getItem(REFRESH_TOKEN_KEY));
  }
};

/**
 * API Response types
 */
export interface GitHubLoginResponse {
  authorization_url: string;
  state: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string; // Optional - refresh endpoint might not return new refresh token
  token_type: string;
  expires_in?: number; // Optional - refresh response might not include this
}

// Combined type - backend can return either format
export type LoginResponse = GitHubLoginResponse | TokenResponse;

export interface UserProfile {
  id: string;
  github_id: number;
  username: string;
  name: string;
  avatar_url: string;
  email: string;
  profile_url: string;
  created_at: string;
  webhook_configured: boolean;
}

export interface GitHubUserDetails {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string; // GitHub account creation date
  updated_at: string;
}

export interface ApiError {
  detail: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  forks_count?: number;
  watchers_count?: number;
  size?: number;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
}

export interface RepositoriesResponse {
  repositories: Repository[];
}

/**
 * Base API request function with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    console.log(`[API] Requesting: ${url}`);

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log(`[API] Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const error: ApiError = await response.json();
        errorMessage = error.detail || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = `${errorMessage}. Could not parse error response.`;
      }

      // Only log non-auth errors to avoid noise from expected token expiration
      const isAuthError = response.status === 401 || errorMessage.includes('credentials');
      if (!isAuthError) {
        console.error(`[API] Error:`, errorMessage);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(`[API] Success:`, data);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
}

/**
 * Authenticated API request with automatic token refresh
 * Includes retry limit to prevent infinite loops
 */
async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> {
  const MAX_RETRIES = 1; // Only retry once to avoid infinite loops

  const accessToken = tokenStorage.getAccessToken();

  if (!accessToken) {
    throw new Error('No access token found. Please log in.');
  }

  try {
    return await apiRequest<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    // If 401 and haven't exceeded retry limit, try to refresh token
    if (
      error instanceof Error &&
      error.message.includes('401') &&
      retryCount < MAX_RETRIES
    ) {
      console.log(`[API] 401 error, attempting token refresh (retry ${retryCount + 1}/${MAX_RETRIES})`);

      try {
        await refreshAccessToken();

        // Retry with new token (increment retry count)
        const newAccessToken = tokenStorage.getAccessToken();

        if (!newAccessToken) {
          throw new Error('Token refresh failed: no access token after refresh');
        }

        return await apiRequest<T>(endpoint, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      } catch (refreshError) {
        console.error('[API] Token refresh failed:', refreshError);
        throw new Error('Session expired. Please log in again.');
      }
    }

    throw error;
  }
}

/**
 * Type guards for login response
 */
export function isTokenResponse(response: LoginResponse): response is TokenResponse {
  return 'access_token' in response && 'refresh_token' in response;
}

export function isGitHubLoginResponse(response: LoginResponse): response is GitHubLoginResponse {
  return 'authorization_url' in response && 'state' in response;
}

/**
 * Authentication API functions
 */
export const authApi = {
  /**
   * Initiate GitHub OAuth login
   * Can return either:
   * - authorization_url + state (first time / needs OAuth)
   * - access_token + refresh_token (already authorized)
   */
  initiateLogin: async (): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>('/auth/github/login');
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (): Promise<TokenResponse> => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    return apiRequest<TokenResponse>('/auth/refresh', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<UserProfile> => {
    return authenticatedRequest<UserProfile>('/auth/me');
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<{ message: string }> => {
    const result = await authenticatedRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
    tokenStorage.clearTokens();
    return result;
  },
};

/**
 * Token refresh state management
 * Prevents race conditions when multiple requests trigger token refresh simultaneously
 */
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

/**
 * Refresh access token helper with race condition protection
 *
 * If multiple requests try to refresh simultaneously, they will all wait
 * for the same refresh operation to complete instead of triggering multiple refreshes.
 */
async function refreshAccessToken(): Promise<void> {
  // If already refreshing, wait for that refresh to complete
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  // Mark as refreshing and create new promise
  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await authApi.refreshToken();

      // Store both tokens from response
      // Backend should return both access_token and refresh_token
      const newRefreshToken = response.refresh_token || tokenStorage.getRefreshToken();

      if (newRefreshToken) {
        tokenStorage.setTokens(response.access_token, newRefreshToken);
      } else {
        throw new Error('No refresh token available');
      }
    } catch (error) {
      // If refresh fails, clear tokens and redirect to login
      console.error(error);
      tokenStorage.clearTokens();

      // Redirect to login on client side
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      throw new Error('Session expired. Please log in again.');
    } finally {
      // Reset refreshing state
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Activity API functions
 */
export const activityApi = {
  /**
   * Get user repositories
   */
  getRepositories: async (query?: string): Promise<RepositoriesResponse> => {
    const params = query ? `?q=${encodeURIComponent(query)}` : '';
    return authenticatedRequest<RepositoriesResponse>(`/activity/repositories${params}`);
  },

  /**
   * Get user activity events
   * @param page - Page number for pagination (1-indexed)
   * @param perPage - Number of events per page (default: 30, max: 100)
   * @returns Promise with events array
   */
  getEvents: async (page: number = 1, perPage: number = 30): Promise<GitHubEventsResponse> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('per_page', String(Math.min(perPage, 100)));
    return authenticatedRequest<GitHubEventsResponse>(`/activity/events?${params}`);
  },
};

/**
 * Webhook API functions
 */
export const webhookApi = {
  /**
   * Setup webhook on a repository
   */
  setupWebhook: async (owner: string, repo: string) => {
    return authenticatedRequest(`/webhooks/setup/${owner}/${repo}`, {
      method: 'POST',
    });
  },

  /**
   * Get webhook notifications
   */
  getNotifications: async (processed?: boolean, limit: number = 50) => {
    const params = new URLSearchParams();
    if (processed !== undefined) {
      params.append('processed', String(processed));
    }
    params.append('limit', String(limit));

    return authenticatedRequest(`/webhooks/notifications?${params}`);
  },

  /**
   * Mark notification as processed
   */
  markNotificationProcessed: async (notificationId: string) => {
    return authenticatedRequest(`/webhooks/notifications/${notificationId}/mark-processed`, {
      method: 'POST',
    });
  },

  /**
   * Mark all notifications as processed
   */
  markAllNotificationsProcessed: async () => {
    return authenticatedRequest('/webhooks/notifications/mark-all-processed', {
      method: 'POST',
    });
  },
};

/**
 * GitHub API functions (direct calls to GitHub API)
 */
export const githubApi = {
  /**
   * Get detailed GitHub user profile information
   *
   * NOTE: This currently uses unauthenticated GitHub API calls (60 req/hour limit).
   * TODO: Backend should expose an endpoint that proxies this request using the user's
   * GitHub token for higher rate limits (5000 req/hour).
   *
   * @param username - GitHub username
   * @returns GitHub user details
   */
  getUserDetails: async (username: string): Promise<GitHubUserDetails> => {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    // Handle rate limiting
    if (response.status === 403) {
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
      const rateLimitReset = response.headers.get('X-RateLimit-Reset');

      if (rateLimitRemaining === '0') {
        const resetTime = rateLimitReset
          ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString()
          : 'unknown';
        throw new Error(`GitHub API rate limit exceeded. Resets at ${resetTime}`);
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[GitHub API] Error:', response.status, errorText);
      throw new Error(`Failed to fetch GitHub user details: ${response.statusText}`);
    }

    return response.json();
  },
};

/**
 * Tests for API utility functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  tokenStorage,
  isTokenResponse,
  isGitHubLoginResponse,
  authApi,
  activityApi,
  webhookApi,
  githubApi,
  TokenResponse,
  GitHubLoginResponse,
} from './api';
import { createMockUserProfile, createMockRepository } from '@/test/mockData';

describe('tokenStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getAccessToken', () => {
    it('should return null when no token is stored', () => {
      expect(tokenStorage.getAccessToken()).toBeNull();
    });

    it('should return stored access token', () => {
      localStorage.setItem('access_token', 'test-token');
      expect(tokenStorage.getAccessToken()).toBe('test-token');
    });

    it('should return null on server side', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      expect(tokenStorage.getAccessToken()).toBeNull();
      global.window = originalWindow;
    });
  });

  describe('getRefreshToken', () => {
    it('should return null when no token is stored', () => {
      expect(tokenStorage.getRefreshToken()).toBeNull();
    });

    it('should return stored refresh token', () => {
      localStorage.setItem('refresh_token', 'refresh-token');
      expect(tokenStorage.getRefreshToken()).toBe('refresh-token');
    });
  });

  describe('setTokens', () => {
    it('should store both access and refresh tokens', () => {
      tokenStorage.setTokens('access-token', 'refresh-token');
      expect(localStorage.getItem('access_token')).toBe('access-token');
      expect(localStorage.getItem('refresh_token')).toBe('refresh-token');
    });

    it('should handle server side gracefully', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      expect(() => tokenStorage.setTokens('a', 'b')).not.toThrow();
      global.window = originalWindow;
    });
  });

  describe('clearTokens', () => {
    it('should remove both tokens from storage', () => {
      localStorage.setItem('access_token', 'test');
      localStorage.setItem('refresh_token', 'test');

      tokenStorage.clearTokens();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
    });
  });

  describe('hasTokens', () => {
    it('should return false when no tokens are stored', () => {
      expect(tokenStorage.hasTokens()).toBe(false);
    });

    it('should return false when only access token is stored', () => {
      localStorage.setItem('access_token', 'test');
      expect(tokenStorage.hasTokens()).toBe(false);
    });

    it('should return false when only refresh token is stored', () => {
      localStorage.setItem('refresh_token', 'test');
      expect(tokenStorage.hasTokens()).toBe(false);
    });

    it('should return true when both tokens are stored', () => {
      localStorage.setItem('access_token', 'test');
      localStorage.setItem('refresh_token', 'test');
      expect(tokenStorage.hasTokens()).toBe(true);
    });
  });
});

describe('Type guards', () => {
  describe('isTokenResponse', () => {
    it('should return true for valid TokenResponse', () => {
      const response: TokenResponse = {
        access_token: 'token',
        refresh_token: 'refresh',
        token_type: 'Bearer',
      };
      expect(isTokenResponse(response)).toBe(true);
    });

    it('should return false for GitHubLoginResponse', () => {
      const response: GitHubLoginResponse = {
        authorization_url: 'https://github.com/login',
        state: 'state123',
      };
      expect(isTokenResponse(response)).toBe(false);
    });

    it('should return false without refresh_token', () => {
      const response = {
        access_token: 'token',
        token_type: 'Bearer',
      };
      // Type guard checks for both access_token AND refresh_token
      expect(isTokenResponse(response as any)).toBe(false);
    });
  });

  describe('isGitHubLoginResponse', () => {
    it('should return true for valid GitHubLoginResponse', () => {
      const response: GitHubLoginResponse = {
        authorization_url: 'https://github.com/login',
        state: 'state123',
      };
      expect(isGitHubLoginResponse(response)).toBe(true);
    });

    it('should return false for TokenResponse', () => {
      const response: TokenResponse = {
        access_token: 'token',
        refresh_token: 'refresh',
        token_type: 'Bearer',
      };
      expect(isGitHubLoginResponse(response)).toBe(false);
    });
  });
});

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initiateLogin', () => {
    it('should call the login endpoint and return response', async () => {
      const mockResponse: GitHubLoginResponse = {
        authorization_url: 'https://github.com/login/oauth/authorize',
        state: 'random-state',
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await authApi.initiateLogin();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/auth/github/login',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ detail: 'Server error' }),
      });

      await expect(authApi.initiateLogin()).rejects.toThrow('Server error');
    });
  });

  describe('refreshToken', () => {
    it('should call refresh endpoint with refresh token', async () => {
      localStorage.setItem('refresh_token', 'old-refresh-token');

      const mockResponse: TokenResponse = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        token_type: 'Bearer',
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authApi.refreshToken();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/auth/refresh',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer old-refresh-token',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when no refresh token exists', async () => {
      await expect(authApi.refreshToken()).rejects.toThrow(
        'No refresh token found'
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return user profile with valid token', async () => {
      const mockUser = createMockUserProfile();
      localStorage.setItem('access_token', 'valid-token');

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await authApi.getCurrentUser();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/auth/me',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-token',
          }),
        })
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw error when no token exists', async () => {
      await expect(authApi.getCurrentUser()).rejects.toThrow(
        'No access token found'
      );
    });
  });

  describe('logout', () => {
    it('should call logout endpoint and clear tokens', async () => {
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('refresh_token', 'refresh');

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Logged out' }),
      });

      const result = await authApi.logout();

      expect(result).toEqual({ message: 'Logged out' });
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
    });
  });
});

describe('activityApi', () => {
  beforeEach(() => {
    localStorage.setItem('access_token', 'test-token');
    vi.clearAllMocks();
  });

  describe('getRepositories', () => {
    it('should fetch repositories without query', async () => {
      const mockRepos = {
        repositories: [createMockRepository()],
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      const result = await activityApi.getRepositories();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/activity/repositories',
        expect.any(Object)
      );
      expect(result).toEqual(mockRepos);
    });

    it('should fetch repositories with query parameter', async () => {
      const mockRepos = {
        repositories: [createMockRepository()],
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      await activityApi.getRepositories('test-query');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/activity/repositories?q=test-query',
        expect.any(Object)
      );
    });
  });

  describe('getEvents', () => {
    it('should fetch events with default pagination', async () => {
      const mockEvents = { events: [] };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      await activityApi.getEvents();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1'),
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('per_page=30'),
        expect.any(Object)
      );
    });

    it('should fetch events with custom pagination', async () => {
      const mockEvents = { events: [] };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      await activityApi.getEvents(2, 50);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('per_page=50'),
        expect.any(Object)
      );
    });

    it('should cap per_page at 100', async () => {
      const mockEvents = { events: [] };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      await activityApi.getEvents(1, 200);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('per_page=100'),
        expect.any(Object)
      );
    });
  });
});

describe('webhookApi', () => {
  beforeEach(() => {
    localStorage.setItem('access_token', 'test-token');
    vi.clearAllMocks();
  });

  describe('setupWebhook', () => {
    it('should call setup webhook endpoint', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await webhookApi.setupWebhook('owner', 'repo');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/webhooks/setup/owner/repo',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  describe('getNotifications', () => {
    it('should fetch notifications with default parameters', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ notifications: [] }),
      });

      await webhookApi.getNotifications();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=50'),
        expect.any(Object)
      );
    });

    it('should fetch notifications with processed filter', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ notifications: [] }),
      });

      await webhookApi.getNotifications(false, 20);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('processed=false'),
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=20'),
        expect.any(Object)
      );
    });
  });

  describe('markNotificationProcessed', () => {
    it('should mark notification as processed', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await webhookApi.markNotificationProcessed('notification-123');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/webhooks/notifications/notification-123/mark-processed',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  describe('markAllNotificationsProcessed', () => {
    it('should mark all notifications as processed', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await webhookApi.markAllNotificationsProcessed();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/webhooks/notifications/mark-all-processed',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });
});

describe('githubApi', () => {
  describe('getUserDetails', () => {
    it('should fetch user details from GitHub API', async () => {
      const mockUser = {
        login: 'testuser',
        id: 12345,
        avatar_url: 'https://avatars.githubusercontent.com/u/12345',
        name: 'Test User',
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await githubApi.getUserDetails('testuser');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser',
        expect.objectContaining({
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        })
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle rate limiting', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 403,
        headers: {
          get: (key: string) => {
            if (key === 'X-RateLimit-Remaining') return '0';
            if (key === 'X-RateLimit-Reset') return '1735689600';
            return null;
          },
        },
      });

      await expect(githubApi.getUserDetails('testuser')).rejects.toThrow(
        'GitHub API rate limit exceeded'
      );
    });

    it('should handle errors', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'User not found',
      });

      await expect(githubApi.getUserDetails('nonexistent')).rejects.toThrow(
        'Failed to fetch GitHub user details'
      );
    });
  });
});

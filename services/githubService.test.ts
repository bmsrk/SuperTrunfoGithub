import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  fetchGithubUser, 
  fetchGithubRepos, 
  summarizeRepoData,
  fetchImageAsBase64 
} from './githubService';
import { GithubRepo } from '../types';

// Mock fetch globally
global.fetch = vi.fn();

describe('githubService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchGithubUser', () => {
    it('should fetch user data successfully', async () => {
      const mockUser = {
        login: 'testuser',
        name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Test bio',
        public_repos: 10,
        followers: 100,
        following: 50,
        created_at: '2020-01-01T00:00:00Z',
        html_url: 'https://github.com/testuser',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await fetchGithubUser('testuser');
      expect(result).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser',
        expect.any(Object)
      );
    });

    it('should throw error for empty username', async () => {
      await expect(fetchGithubUser('')).rejects.toThrow('Username is required');
      await expect(fetchGithubUser('  ')).rejects.toThrow('Username is required');
    });

    it('should throw error for 404 response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchGithubUser('nonexistent')).rejects.toThrow(
        'User "nonexistent" not found on GitHub.'
      );
    });

    it('should throw error for 403 rate limit', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      await expect(fetchGithubUser('testuser')).rejects.toThrow(
        'GitHub API rate limit exceeded'
      );
    });

    it('should include token in headers when provided', async () => {
      const mockUser = { login: 'testuser' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      await fetchGithubUser('testuser', 'test-token');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'token test-token',
          }),
        })
      );
    });
  });

  describe('fetchGithubRepos', () => {
    it('should fetch repos successfully', async () => {
      const mockRepos = [
        { name: 'repo1', stargazers_count: 10, language: 'JavaScript' },
        { name: 'repo2', stargazers_count: 5, language: 'Python' },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      const result = await fetchGithubRepos('testuser');
      expect(result).toEqual(mockRepos);
    });

    it('should return empty array on error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await fetchGithubRepos('testuser');
      expect(result).toEqual([]);
    });

    it('should handle network errors gracefully', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchGithubRepos('testuser');
      expect(result).toEqual([]);
    });
  });

  describe('summarizeRepoData', () => {
    it('should summarize repo data correctly', () => {
      const repos: GithubRepo[] = [
        {
          name: 'repo1',
          language: 'JavaScript',
          stargazers_count: 100,
          forks_count: 10,
          fork: false,
          description: 'A JS repo',
          topics: ['react', 'frontend'],
        } as GithubRepo,
        {
          name: 'repo2',
          language: 'Python',
          stargazers_count: 50,
          forks_count: 5,
          fork: false,
          description: 'A Python repo',
          topics: ['ml', 'ai'],
        } as GithubRepo,
        {
          name: 'repo3',
          language: 'JavaScript',
          stargazers_count: 25,
          forks_count: 3,
          fork: true,
          description: 'A forked repo',
          topics: [],
        } as GithubRepo,
      ];

      const result = summarizeRepoData(repos);

      expect(result.topLanguages).toEqual(['JavaScript', 'Python']);
      expect(result.totalStars).toBe(175);
      expect(result.totalForks).toBe(18);
      expect(result.repoCount).toBe(3);
      expect(result.originalRepoCount).toBe(2);
      expect(result.allTopics).toContain('react');
      expect(result.allTopics).toContain('ml');
      expect(result.repoNames).toHaveLength(3);
      expect(result.repoDescriptions).toHaveLength(3);
    });

    it('should handle empty repo array', () => {
      const result = summarizeRepoData([]);

      expect(result.topLanguages).toEqual([]);
      expect(result.totalStars).toBe(0);
      expect(result.totalForks).toBe(0);
      expect(result.repoCount).toBe(0);
      expect(result.originalRepoCount).toBe(0);
    });

    it('should handle null or invalid input', () => {
      const result = summarizeRepoData(null as any);

      expect(result.topLanguages).toEqual([]);
      expect(result.totalStars).toBe(0);
      expect(result.repoCount).toBe(0);
    });

    it('should limit top languages to 3', () => {
      const repos: GithubRepo[] = [
        { language: 'JavaScript', stargazers_count: 10, forks_count: 0, fork: false } as GithubRepo,
        { language: 'Python', stargazers_count: 10, forks_count: 0, fork: false } as GithubRepo,
        { language: 'Java', stargazers_count: 10, forks_count: 0, fork: false } as GithubRepo,
        { language: 'Go', stargazers_count: 10, forks_count: 0, fork: false } as GithubRepo,
        { language: 'Rust', stargazers_count: 10, forks_count: 0, fork: false } as GithubRepo,
      ];

      const result = summarizeRepoData(repos);
      expect(result.topLanguages).toHaveLength(3);
    });

    it('should handle repos without language', () => {
      const repos: GithubRepo[] = [
        { language: null, stargazers_count: 10, forks_count: 0, fork: false } as GithubRepo,
      ];

      const result = summarizeRepoData(repos);
      expect(result.topLanguages).toEqual([]);
      expect(result.totalStars).toBe(10);
    });
  });

  describe('fetchImageAsBase64', () => {
    it('should convert image to base64', async () => {
      const mockBlob = new Blob(['fake image data'], { type: 'image/jpeg' });
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob,
      });

      // Mock FileReader as a constructor
      class MockFileReader {
        result = 'data:image/jpeg;base64,ZmFrZSBpbWFnZSBkYXRh';
        onloadend: (() => void) | null = null;
        onerror: ((error: any) => void) | null = null;
        
        readAsDataURL = vi.fn(function(this: MockFileReader) {
          setTimeout(() => {
            this.onloadend?.();
          }, 0);
        });
      }

      global.FileReader = MockFileReader as any;

      const result = await fetchImageAsBase64('https://example.com/image.jpg');
      
      expect(result.mimeType).toBe('image/jpeg');
      expect(result.base64).toBe('ZmFrZSBpbWFnZSBkYXRh');
    });

    it('should throw error for empty URL', async () => {
      await expect(fetchImageAsBase64('')).rejects.toThrow('No image URL provided');
    });

    it('should handle fetch errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchImageAsBase64('https://example.com/notfound.jpg')).rejects.toThrow();
    });

    it('should add size parameter to URL', async () => {
      const mockBlob = new Blob(['fake image data'], { type: 'image/jpeg' });
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob,
      });

      // Mock FileReader as a constructor
      class MockFileReader {
        result = 'data:image/jpeg;base64,ZmFrZSBpbWFnZSBkYXRh';
        onloadend: (() => void) | null = null;
        onerror: ((error: any) => void) | null = null;
        
        readAsDataURL = vi.fn(function(this: MockFileReader) {
          setTimeout(() => {
            this.onloadend?.();
          }, 0);
        });
      }

      global.FileReader = MockFileReader as any;

      await fetchImageAsBase64('https://example.com/image.jpg');
      
      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('s=512');
    });
  });
});

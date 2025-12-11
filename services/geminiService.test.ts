import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateBasicCardData } from './geminiService';
import { GithubUser } from '../types';

// Mock the Google GenAI module
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn(),
  Type: {
    OBJECT: 'object',
    STRING: 'string',
    NUMBER: 'number',
    ARRAY: 'array',
  },
}));

describe('geminiService', () => {
  describe('generateBasicCardData', () => {
    const mockUser: GithubUser = {
      login: 'testuser',
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      bio: 'A passionate developer',
      public_repos: 50,
      followers: 200,
      following: 100,
      created_at: '2020-01-01T00:00:00Z',
      html_url: 'https://github.com/testuser',
      location: 'São Paulo',
      company: 'Tech Corp',
      twitter_username: 'testuser',
      blog: 'https://test.dev',
      hireable: true,
    };

    const mockRepoSummary = {
      topLanguages: ['JavaScript', 'TypeScript', 'Python'],
      totalStars: 500,
      totalForks: 100,
      repoCount: 50,
      allTopics: ['react', 'nodejs', 'ai'],
      repoNames: ['awesome-project', 'cool-lib', 'data-viz'],
      repoDescriptions: ['An awesome project', 'A cool library'],
      originalRepoCount: 45,
    };

    it('should generate basic card data with correct structure', () => {
      const result = generateBasicCardData(mockUser, mockRepoSummary);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('archetype');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('stats');
      expect(result).toHaveProperty('specialAbility');
      expect(result).toHaveProperty('superTrunfoAttribute');
    });

    it('should generate correct stats array', () => {
      const result = generateBasicCardData(mockUser, mockRepoSummary);

      expect(result.stats).toHaveLength(4);
      expect(result.stats[0].label).toBe('Repositórios');
      expect(result.stats[0].value).toBe(mockUser.public_repos);
      expect(result.stats[1].label).toBe('Estrelas');
      expect(result.stats[1].value).toBe(mockRepoSummary.totalStars);
      expect(result.stats[2].label).toBe('Seguidores');
      expect(result.stats[2].value).toBe(mockUser.followers);
      expect(result.stats[3].label).toBe('Commits');
      expect(result.stats[3].value).toBeGreaterThan(0);
    });

    it('should calculate commits based on formula', () => {
      const result = generateBasicCardData(mockUser, mockRepoSummary);
      const commitStat = result.stats.find(s => s.label === 'Commits');
      
      // Basic formula: public_repos * 50 + accountAge * 300
      const currentYear = new Date().getFullYear();
      const accountYear = new Date(mockUser.created_at).getFullYear();
      const accountAge = currentYear - accountYear;
      const expectedCommits = 50 * 50 + accountAge * 300;
      
      expect(commitStat?.value).toBe(expectedCommits);
    });

    it('should select appropriate archetype based on language', () => {
      const jsUser = { ...mockUser };
      const jsRepoSummary = { ...mockRepoSummary, topLanguages: ['JavaScript'] };
      
      const result = generateBasicCardData(jsUser, jsRepoSummary);
      expect(result.archetype).toBe('Frontend Alchemist');
    });

    it('should handle TypeScript developers', () => {
      const tsRepoSummary = { ...mockRepoSummary, topLanguages: ['TypeScript'] };
      const result = generateBasicCardData(mockUser, tsRepoSummary);
      expect(result.archetype).toBe('Type-Safe Paladin');
    });

    it('should handle Python developers', () => {
      const pyRepoSummary = { ...mockRepoSummary, topLanguages: ['Python'] };
      const result = generateBasicCardData(mockUser, pyRepoSummary);
      expect(result.archetype).toBe('Data Sorcerer');
    });

    it('should handle Java developers', () => {
      const javaRepoSummary = { ...mockRepoSummary, topLanguages: ['Java'] };
      const result = generateBasicCardData(mockUser, javaRepoSummary);
      expect(result.archetype).toBe('Enterprise Architect');
    });

    it('should handle Go developers', () => {
      const goRepoSummary = { ...mockRepoSummary, topLanguages: ['Go'] };
      const result = generateBasicCardData(mockUser, goRepoSummary);
      expect(result.archetype).toBe('Concurrency Master');
    });

    it('should handle Rust developers', () => {
      const rustRepoSummary = { ...mockRepoSummary, topLanguages: ['Rust'] };
      const result = generateBasicCardData(mockUser, rustRepoSummary);
      expect(result.archetype).toBe('Memory Guardian');
    });

    it('should handle unknown languages with generic archetype', () => {
      const unknownRepoSummary = { ...mockRepoSummary, topLanguages: ['Kotlin'] };
      const result = generateBasicCardData(mockUser, unknownRepoSummary);
      expect(result.archetype).toBe('Kotlin Developer');
    });

    it('should handle empty language list', () => {
      const emptyRepoSummary = { ...mockRepoSummary, topLanguages: [] };
      const result = generateBasicCardData(mockUser, emptyRepoSummary);
      expect(result.archetype).toBe('Code Developer');
    });

    it('should select trump attribute based on highest stat', () => {
      // User with high followers
      const highFollowerUser = { ...mockUser, followers: 10000 };
      const result = generateBasicCardData(highFollowerUser, mockRepoSummary);
      
      const maxStat = result.stats.reduce((max, stat) => 
        stat.value > max.value ? stat : max
      );
      
      expect(result.superTrunfoAttribute).toBe(maxStat.label);
    });

    it('should generate valid ID format', () => {
      const result = generateBasicCardData(mockUser, mockRepoSummary);
      expect(result.id).toMatch(/^DEV-\d{2}$/);
    });

    it('should generate description', () => {
      const result = generateBasicCardData(mockUser, mockRepoSummary);
      expect(result.description).toBeTruthy();
      expect(typeof result.description).toBe('string');
      expect(result.description.length).toBeGreaterThan(0);
    });

    it('should generate special ability with name and description', () => {
      const result = generateBasicCardData(mockUser, mockRepoSummary);
      
      expect(result.specialAbility).toHaveProperty('name');
      expect(result.specialAbility).toHaveProperty('description');
      expect(result.specialAbility.name).toBeTruthy();
      expect(result.specialAbility.description).toBeTruthy();
    });

    it('should handle user with minimal data', () => {
      const minimalUser: GithubUser = {
        login: 'minimal',
        name: null,
        avatar_url: 'https://example.com/avatar.jpg',
        bio: null,
        public_repos: 1,
        followers: 0,
        following: 0,
        created_at: new Date().toISOString(),
        html_url: 'https://github.com/minimal',
        location: null,
        company: null,
        twitter_username: null,
        blog: null,
        hireable: null,
      };

      const minimalSummary = {
        topLanguages: [],
        totalStars: 0,
        totalForks: 0,
        repoCount: 1,
        allTopics: [],
        repoNames: [],
        repoDescriptions: [],
        originalRepoCount: 1,
      };

      const result = generateBasicCardData(minimalUser, minimalSummary);
      
      expect(result).toBeTruthy();
      expect(result.stats).toHaveLength(4);
      expect(result.id).toMatch(/^DEV-\d{2}$/);
    });

    it('should handle user with very old account', () => {
      const oldUser = { ...mockUser, created_at: '2008-01-01T00:00:00Z' };
      const result = generateBasicCardData(oldUser, mockRepoSummary);
      
      const commitStat = result.stats.find(s => s.label === 'Commits');
      // Old accounts should have higher commit estimates
      expect(commitStat?.value).toBeGreaterThan(5000);
    });

    it('should handle user with many repos', () => {
      const activeUser = { ...mockUser, public_repos: 500 };
      const result = generateBasicCardData(activeUser, mockRepoSummary);
      
      const commitStat = result.stats.find(s => s.label === 'Commits');
      // Many repos should increase commit estimate
      expect(commitStat?.value).toBeGreaterThan(10000);
    });
  });

  describe('Prompt Personalization Logic', () => {
    it('should create different archetypes for different languages', () => {
      const baseUser: GithubUser = {
        login: 'testuser',
        name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Developer',
        public_repos: 50,
        followers: 100,
        following: 50,
        created_at: '2020-01-01T00:00:00Z',
        html_url: 'https://github.com/testuser',
        location: null,
        company: null,
        twitter_username: null,
        blog: null,
        hireable: null,
      };

      const baseSummary = {
        topLanguages: [],
        totalStars: 100,
        totalForks: 50,
        repoCount: 50,
        allTopics: [],
        repoNames: [],
        repoDescriptions: [],
        originalRepoCount: 45,
      };

      const languages = ['JavaScript', 'Python', 'Java', 'Go', 'Rust', 'Ruby'];
      const archetypes = languages.map(lang => {
        const summary = { ...baseSummary, topLanguages: [lang] };
        const card = generateBasicCardData(baseUser, summary);
        return card.archetype;
      });

      // All archetypes should be unique
      const uniqueArchetypes = new Set(archetypes);
      expect(uniqueArchetypes.size).toBe(languages.length);
    });

    it('should generate consistent results for same input', () => {
      const user: GithubUser = {
        login: 'consistent',
        name: 'Consistent User',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Test',
        public_repos: 25,
        followers: 50,
        following: 25,
        created_at: '2020-01-01T00:00:00Z',
        html_url: 'https://github.com/consistent',
        location: null,
        company: null,
        twitter_username: null,
        blog: null,
        hireable: null,
      };

      const summary = {
        topLanguages: ['JavaScript'],
        totalStars: 100,
        totalForks: 50,
        repoCount: 25,
        allTopics: [],
        repoNames: [],
        repoDescriptions: [],
        originalRepoCount: 20,
      };

      const result1 = generateBasicCardData(user, summary);
      const result2 = generateBasicCardData(user, summary);

      // Stats should be consistent
      expect(result1.stats).toEqual(result2.stats);
      expect(result1.archetype).toBe(result2.archetype);
      // Note: description and specialAbility are random, so they might differ
    });
  });
});

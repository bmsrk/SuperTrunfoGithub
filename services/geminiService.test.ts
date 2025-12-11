import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateLocalCardStats } from './geminiService';
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
  describe('generateLocalCardStats', () => {
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
      const result = generateLocalCardStats(mockUser, mockRepoSummary);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('archetype');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('stats');
      expect(result).toHaveProperty('specialAbility');
      expect(result).toHaveProperty('superTrunfoAttribute');
    });

    it('should generate correct stats array', () => {
      const result = generateLocalCardStats(mockUser, mockRepoSummary);

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
      const result = generateLocalCardStats(mockUser, mockRepoSummary);
      const commitStat = result.stats.find(s => s.label === 'Commits');
      
      // New formula: public_repos * 60 + accountAge * 400 + totalStars * 2 + originalRepoCount * 30
      const currentYear = new Date().getFullYear();
      const accountYear = new Date(mockUser.created_at).getFullYear();
      const accountAge = Math.max(1, currentYear - accountYear);
      const expectedCommits = mockUser.public_repos * 60 + accountAge * 400 + mockRepoSummary.totalStars * 2 + mockRepoSummary.originalRepoCount * 30;
      
      expect(commitStat?.value).toBe(expectedCommits);
    });

    it('should select appropriate archetype based on language from available options', () => {
      const jsUser = { ...mockUser };
      const jsRepoSummary = { ...mockRepoSummary, topLanguages: ['JavaScript'] };
      
      const result = generateLocalCardStats(jsUser, jsRepoSummary);
      // With weighted random selection, archetype should be one of the JavaScript options
      const validArchetypes = [
        'Async Sorcerer', 'Promise Whisperer', 'Event Loop Maestro', 
        'Callback Conjurer', 'DOM Manipulator Supreme', 'ES6 Archmage', 
        'Node.js Necromancer', 'Closure Craftsman', 'Prototype Prophet',
        'Module Bundler Maven', 'JSON Juggler', 'Webpack Wizard',
        'React Router Ranger', 'Babel Bard', 'npm Nomad',
        'Express.js Engineer', 'V8 Virtuoso', 'Middleware Mystic',
        'Hoisting Handler', 'Scope Chain Shaman', 'This Binding Titan'
      ];
      expect(validArchetypes).toContain(result.archetype);
    });

    it('should handle TypeScript developers', () => {
      const tsRepoSummary = { ...mockRepoSummary, topLanguages: ['TypeScript'] };
      const result = generateLocalCardStats(mockUser, tsRepoSummary);
      const validArchetypes = [
        'Type Enforcer', 'Generic Overlord', 'Interface Sculptor', 
        'Compiler Tamer', 'Strict Mode Champion', 'Decorator Virtuoso',
        'Angular Guardian', 'Union Type Unifier', 'Namespace Navigator',
        'Type Guard Gladiator', 'Enum Enchanter', 'Tuple Tactician',
        'Conditional Type Conjurer', 'Mapped Type Master', 'Utility Type Utilizer',
        'Type Inference Invoker', 'Readonly Ruler', 'Const Assertion Champion',
        'Literal Type Lord', 'Template Literal Luminary', 'Type Predicate Paladin'
      ];
      expect(validArchetypes).toContain(result.archetype);
    });

    it('should handle Python developers', () => {
      const pyRepoSummary = { ...mockRepoSummary, topLanguages: ['Python'] };
      const result = generateLocalCardStats(mockUser, pyRepoSummary);
      const validArchetypes = [
        'Pythonic Sage', 'List Comprehension Master', 'Pandas Wrangler', 
        'Decorator Enchanter', 'Django Dynamo', 'Flask Alchemist', 
        'Data Pipeline Architect', 'Snake Charmer', 'Generator Guardian',
        'Lambda Luminary', 'Context Manager Commander', 'Metaclass Mystic',
        'NumPy Ninja', 'Scikit-Learn Sensei', 'TensorFlow Titan',
        'AsyncIO Adept', 'Type Hint Herald', 'Pytest Prophet',
        'Virtual Environment Virtuoso', 'pip Package Practitioner', 'PEP Perfectionist'
      ];
      expect(validArchetypes).toContain(result.archetype);
    });

    it('should handle Java developers', () => {
      const javaRepoSummary = { ...mockRepoSummary, topLanguages: ['Java'] };
      const result = generateLocalCardStats(mockUser, javaRepoSummary);
      const validArchetypes = [
        'Spring Framework Oracle', 'Thread Pool Tactician', 'Maven Magister', 
        'Garbage Collection Guru', 'Exception Handler Extraordinaire', 
        'Annotation Architect', 'Bytecode Blacksmith', 'JVM Jedi',
        'Hibernate Harbinger', 'Stream API Sorcerer', 'Lambda Lord',
        'Optional Optimizer', 'Reflection Ranger', 'Serialization Sentinel',
        'Concurrency Connoisseur', 'Design Pattern Devotee', 'JDBC Journeyman',
        'Gradle Grandmaster', 'Microservice Monarch', 'Spring Boot Baron',
        'Dependency Injection Diplomat'
      ];
      expect(validArchetypes).toContain(result.archetype);
    });

    it('should handle Go developers', () => {
      const goRepoSummary = { ...mockRepoSummary, topLanguages: ['Go'] };
      const result = generateLocalCardStats(mockUser, goRepoSummary);
      const validArchetypes = [
        'Channel Conductor', 'Goroutine Grandmaster', 'Concurrency Crusader', 
        'Interface Implementor', 'Gopher Commander', 'Microservice Maverick',
        'Error Handler Elite', 'Defer Defender', 'Panic Recovery Ranger',
        'Go Modules Manager', 'Context Conjurer', 'Slice Surgeon',
        'Map Manipulator', 'Struct Sculptor', 'Method Maestro',
        'Package Practitioner', 'Testing Table Titan', 'Benchmark Baron',
        'HTTP Handler Hero', 'JSON Marshal Master', 'Buffer Builder Bard'
      ];
      expect(validArchetypes).toContain(result.archetype);
    });

    it('should handle Rust developers', () => {
      const rustRepoSummary = { ...mockRepoSummary, topLanguages: ['Rust'] };
      const result = generateLocalCardStats(mockUser, rustRepoSummary);
      const validArchetypes = [
        'Borrow Checker Whisperer', 'Memory Safety Sentinel', 'Lifetime Legend', 
        'Ownership Oracle', 'Zero-Cost Zealot', 'Cargo Cultist',
        'Systems Programming Samurai', 'Trait Implementor Titan', 'Macro Magician',
        'Result Type Ranger', 'Option Handler Oracle', 'Pattern Matching Paladin',
        'Smart Pointer Sage', 'Unsafe Code Sentinel', 'Iterator Invoker',
        'Async Runtime Ruler', 'Fearless Concurrency Champion', 'Move Semantics Master',
        'Type State Tactician', 'Phantom Type Philosopher', 'Compiler Error Conqueror'
      ];
      expect(validArchetypes).toContain(result.archetype);
    });

    it('should handle Kotlin developers with valid archetype', () => {
      const kotlinRepoSummary = { ...mockRepoSummary, topLanguages: ['Kotlin'] };
      const result = generateLocalCardStats(mockUser, kotlinRepoSummary);
      const validArchetypes = [
        'Coroutine Conjurer', 'Extension Function Expert', 'Sealed Class Specialist', 
        'Data Class Dynamo', 'Jetpack Compose Composer', 'Android Authority',
        'Null-Safety Knight', 'Scope Function Sage', 'Delegation Diplomat',
        'Inline Function Innovator', 'Reified Type Ruler', 'DSL Designer',
        'Flow Facilitator', 'Channel Champion', 'Multiplatform Maven',
        'Context Receiver Ranger', 'Value Class Virtuoso', 'Contracts Champion',
        'Smart Cast Sorcerer', 'When Expression Wizard', 'Destructuring Declaration Devotee'
      ];
      expect(validArchetypes).toContain(result.archetype);
    });

    it('should handle empty language list with generic archetype', () => {
      const emptyRepoSummary = { ...mockRepoSummary, topLanguages: [] };
      const result = generateLocalCardStats(mockUser, emptyRepoSummary);
      const validArchetypes = [
        'Code Craftsman', 'Digital Architect', 'Syntax Sorcerer',
        'Framework Fanatic', 'Pattern Practitioner', 'Full-Stack Virtuoso',
        'Polyglot Developer'
      ];
      expect(validArchetypes).toContain(result.archetype);
    });

    it('should select trump attribute based on highest stat', () => {
      // User with high followers
      const highFollowerUser = { ...mockUser, followers: 10000 };
      const result = generateLocalCardStats(highFollowerUser, mockRepoSummary);
      
      const maxStat = result.stats.reduce((max, stat) => 
        stat.value > max.value ? stat : max
      );
      
      expect(result.superTrunfoAttribute).toBe(maxStat.label);
    });

    it('should generate valid ID format', () => {
      const result = generateLocalCardStats(mockUser, mockRepoSummary);
      expect(result.id).toMatch(/^DEV-\d{2}$/);
    });

    it('should generate description', () => {
      const result = generateLocalCardStats(mockUser, mockRepoSummary);
      expect(result.description).toBeTruthy();
      expect(typeof result.description).toBe('string');
      expect(result.description.length).toBeGreaterThan(0);
    });

    it('should generate special ability with name and description', () => {
      const result = generateLocalCardStats(mockUser, mockRepoSummary);
      
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

      const result = generateLocalCardStats(minimalUser, minimalSummary);
      
      expect(result).toBeTruthy();
      expect(result.stats).toHaveLength(4);
      expect(result.id).toMatch(/^DEV-\d{2}$/);
    });

    it('should handle user with very old account', () => {
      const oldUser = { ...mockUser, created_at: '2008-01-01T00:00:00Z' };
      const result = generateLocalCardStats(oldUser, mockRepoSummary);
      
      const commitStat = result.stats.find(s => s.label === 'Commits');
      // Old accounts should have higher commit estimates
      expect(commitStat?.value).toBeGreaterThan(5000);
    });

    it('should handle user with many repos', () => {
      const activeUser = { ...mockUser, public_repos: 500 };
      const result = generateLocalCardStats(activeUser, mockRepoSummary);
      
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
        const card = generateLocalCardStats(baseUser, summary);
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

      const result1 = generateLocalCardStats(user, summary);
      const result2 = generateLocalCardStats(user, summary);

      // Stats should be consistent
      expect(result1.stats).toEqual(result2.stats);
      expect(result1.archetype).toBe(result2.archetype);
      // Note: description and specialAbility are random, so they might differ
    });
  });
});

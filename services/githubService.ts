import { GithubUser, GithubRepo } from '../types';

const BASE_URL = 'https://api.github.com';

const getHeaders = (token?: string) => {
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json'
    };
    if (token) {
        headers['Authorization'] = `token ${token}`;
    }
    return headers;
};

export const fetchGithubUser = async (username: string, token?: string): Promise<GithubUser> => {
  const cleanUsername = username.trim();
  if (!cleanUsername) throw new Error('Username is required');

  try {
    const response = await fetch(`${BASE_URL}/users/${cleanUsername}`, {
      headers: getHeaders(token)
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`User "${cleanUsername}" not found on GitHub.`);
      }
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Add a Token to increase limits.');
      }
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error while fetching GitHub user.');
  }
};

export const fetchGithubRepos = async (username: string, token?: string): Promise<GithubRepo[]> => {
  try {
    const response = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=30`, {
        headers: getHeaders(token)
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch repos for ${username}: ${response.status}`);
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.warn("Network error fetching repos, proceeding with empty list.", error);
    return [];
  }
};

export const summarizeRepoData = (repos: GithubRepo[]) => {
  const languages: Record<string, number> = {};
  let totalStars = 0;
  let totalForks = 0;
  const topics = new Set<string>();
  const repoNames: string[] = [];
  const descriptions: string[] = [];
  let originalRepoCount = 0;

  if (!repos || !Array.isArray(repos)) {
      return { 
        topLanguages: [], 
        totalStars: 0, 
        totalForks: 0, 
        repoCount: 0,
        allTopics: [],
        repoNames: [],
        repoDescriptions: [],
        originalRepoCount: 0
      };
  }

  repos.forEach(repo => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    
    // Collect topics
    if (repo.topics && Array.isArray(repo.topics)) {
      repo.topics.forEach(topic => topics.add(topic));
    }
    
    // Track original vs forked
    if (!repo.fork) {
      originalRepoCount++;
    }
    
    // Collect repo names and descriptions for context
    repoNames.push(repo.name);
    if (repo.description) {
      descriptions.push(repo.description);
    }
  });

  const topLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([lang]) => lang);

  return {
    topLanguages,
    totalStars,
    totalForks,
    repoCount: repos.length,
    allTopics: Array.from(topics).slice(0, 10), // Top 10 topics
    repoNames: repoNames.slice(0, 5), // First 5 repo names
    repoDescriptions: descriptions.slice(0, 3), // First 3 descriptions
    originalRepoCount
  };
};

export const fetchImageAsBase64 = async (url: string): Promise<{ base64: string; mimeType: string }> => {
  if (!url) throw new Error("No image URL provided");

  try {
    // Append size param to get a decent resolution but not huge
    const urlObj = new URL(url);
    urlObj.searchParams.set('s', '512');
    
    const response = await fetch(urlObj.toString());
    if (!response.ok) throw new Error("Failed to load image from GitHub");
    
    const blob = await response.blob();
    const mimeType = blob.type || 'image/jpeg';
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (!base64String) {
            reject(new Error("Empty result from FileReader"));
            return;
        }
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        resolve({ base64: base64Data, mimeType });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64", error);
    throw new Error("Failed to process profile image");
  }
};
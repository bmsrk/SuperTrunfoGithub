import { useState } from 'react';
import { CombinedProfile } from '../types';
import { fetchGithubUser, fetchGithubRepos, summarizeRepoData } from '../services/githubService';
import { generateCardStats } from '../services/geminiService';

export const useCardGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CombinedProfile | null>(null);

  const generateCard = async (username: string, githubToken?: string) => {
    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      // 1. Fetch GitHub Data
      const user = await fetchGithubUser(username, githubToken);
      const repos = await fetchGithubRepos(username, githubToken);
      const repoSummary = summarizeRepoData(repos);

      // 2. Generate Stats - Use local deterministic generator (no external API key)
      const cardData = await generateCardStats(user, repoSummary);
      
      // 3. No AI Image generation without external API key
      // The application uses the GitHub avatar by default
      const aiImageUrl: string | undefined = undefined;

      setProfile({ user, cardData, aiImageUrl });

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check the username.');
    } finally {
      setLoading(false);
    }
  };

  const setMockProfile = (mockData: CombinedProfile) => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
        setProfile(mockData);
        setLoading(false);
    }, 1500);
  };

  const resetProfile = () => setProfile(null);

  return {
    loading,
    error,
    profile,
    generateCard,
    setMockProfile,
    resetProfile
  };
};
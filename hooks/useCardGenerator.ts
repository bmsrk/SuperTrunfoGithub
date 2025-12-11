import { useState } from 'react';
import { CombinedProfile } from '../types';
import { fetchGithubUser, fetchGithubRepos, summarizeRepoData, fetchImageAsBase64 } from '../services/githubService';
import { generateCardStats, generateCharacterImage, generateBasicCardData } from '../services/geminiService';

export const useCardGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CombinedProfile | null>(null);

  const generateCard = async (username: string, githubToken?: string, googleApiKey?: string) => {
    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      // 1. Fetch GitHub Data
      const user = await fetchGithubUser(username, githubToken);
      const repos = await fetchGithubRepos(username, githubToken);
      const repoSummary = summarizeRepoData(repos);

      // 2. Generate Stats - Always try AI generation (uses default key if none provided)
      let cardData;
      try {
        cardData = await generateCardStats(user, repoSummary, googleApiKey);
      } catch (err) {
        console.warn("AI card generation failed, using basic generation", err);
        cardData = generateBasicCardData(user, repoSummary);
      }
      
      // 3. Generate AI Image - Always attempt (uses default key if none provided)
      let aiImageUrl: string | undefined = undefined;
      try {
          const imageData = await fetchImageAsBase64(user.avatar_url);
          aiImageUrl = await generateCharacterImage(imageData, cardData.archetype, repoSummary.topLanguages[0] || 'Code', googleApiKey);
      } catch (e) {
          console.warn("Failed to fetch/generate image, trying generation without source image...", e);
          try {
             // Fallback to text-only generation
             aiImageUrl = await generateCharacterImage(null, cardData.archetype, repoSummary.topLanguages[0] || 'Code', googleApiKey);
          } catch (innerE) {
             console.warn("AI Image generation completely failed, will use GitHub avatar", innerE);
          }
      }

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
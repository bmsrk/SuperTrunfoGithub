import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { Card } from './components/Card';
import { CombinedProfile } from './types';
import { fetchGithubUser, fetchGithubRepos, summarizeRepoData, fetchImageAsBase64 } from './services/githubService';
import { generateCardStats, generateCharacterImage } from './services/geminiService';
import { RefreshCcw, Download, Sparkles } from 'lucide-react';
import { renderCardToCanvas } from './utils/cardRenderer';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CombinedProfile | null>(null);

  const handleGenerate = async (username: string) => {
    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      // 1. Fetch GitHub Data
      const user = await fetchGithubUser(username);
      const repos = await fetchGithubRepos(username);
      const repoSummary = summarizeRepoData(repos);

      // 2. Generate Stats via Gemini
      const cardData = await generateCardStats(user, repoSummary);
      
      let aiImageUrl = undefined;
      try {
          // 3. Generate AI Image
          const imageData = await fetchImageAsBase64(user.avatar_url);
          aiImageUrl = await generateCharacterImage(imageData, cardData.archetype, repoSummary.topLanguages[0] || 'Code');
      } catch (e) {
          console.warn("Failed to fetch/generate image, trying generation without source image...", e);
          try {
             // Fallback to text-only generation if fetching avatar failed entirely
             aiImageUrl = await generateCharacterImage(null, cardData.archetype, repoSummary.topLanguages[0] || 'Code');
          } catch (innerE) {
             console.warn("AI Image generation completely failed", innerE);
          }
      }

      setProfile({ user, cardData, aiImageUrl });

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check the username or API key.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCard = async () => {
    if (!profile) return;
    try {
        const dataUrl = await renderCardToCanvas(profile);
        const link = document.createElement('a');
        link.download = `dev-trunfo-${profile.user.login}.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error("Export failed", err);
        alert("Failed to export image.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center py-12 px-4 relative overflow-x-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-yellow-900/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-12">
        
        {/* Input Section - Hide when result is shown */}
        {!profile && (
            <div className={`transition-all duration-500 ease-in-out w-full flex justify-center`}>
                <InputForm onSubmit={handleGenerate} isLoading={loading} />
            </div>
        )}

        {/* Error Message */}
        {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-lg animate-fade-in shadow-lg">
                ⚠️ {error}
            </div>
        )}

        {/* Loading State */}
        {loading && (
            <div className="flex flex-col items-center gap-6 animate-pulse">
                <div className="w-[340px] aspect-[340/580] bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-zinc-800 opacity-50"></div>
                    <Sparkles className="text-yellow-500 animate-spin mb-4 relative z-10" size={48} />
                    <p className="font-tech text-yellow-500 tracking-widest text-center text-sm relative z-10">
                        COMPILING ASSETS...<br/>
                        GENERATING ART...<br/>
                        CALCULATING STATS...
                    </p>
                </div>
            </div>
        )}

        {/* Result Section */}
        {profile && !loading && (
            <div className="flex flex-col items-center gap-8 animate-slide-up w-full">
                
                <Card data={profile} />

                <div className="flex gap-4">
                    <button 
                        onClick={downloadCard}
                        className="flex items-center justify-center gap-2 bg-yellow-500 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition-all hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                    >
                        <Download size={20} /> Download Card
                    </button>
                    
                    <button 
                        onClick={() => setProfile(null)}
                        className="flex items-center justify-center gap-2 bg-zinc-800 text-zinc-300 font-bold py-3 px-8 rounded-full hover:bg-zinc-700 transition-colors border border-zinc-700"
                    >
                        <RefreshCcw size={20} /> Create New
                    </button>
                </div>
                
                <p className="text-zinc-500 text-xs font-mono mt-4">
                   Generated with Gemini 2.5 • Developed by DevTrunfo
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;
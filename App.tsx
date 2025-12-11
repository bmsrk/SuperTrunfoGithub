import React, { useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { Card } from './components/Card';
import { CombinedProfile } from './types';
import { RefreshCcw, Download, Sparkles } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useCardGenerator } from './hooks/useCardGenerator';

const MOCK_PROFILE: CombinedProfile = {
  user: {
    login: "mock-dev",
    name: "Testor the Great",
    avatar_url: "https://avatars.githubusercontent.com/u/9919?v=4",
    bio: "I exist solely to test this application.",
    public_repos: 1337,
    followers: 420,
    following: 0,
    created_at: "2010-01-01T00:00:00Z",
    html_url: "https://github.com",
    location: "Silicon Valley",
    company: "Test Corp",
    twitter_username: "mockdev",
    blog: "https://mockdev.example.com",
    hireable: true,
  },
  cardData: {
    id: "DEV-00",
    archetype: "System Architect",
    description: "Compiles code with a stare.",
    stats: [
        { label: "Repositórios", value: 1337 },
        { label: "Estrelas", value: 9001 },
        { label: "Seguidores", value: 420 },
        { label: "Commits", value: 50000, unit: "+" }
    ],
    specialAbility: {
        name: "Hotfix Instantâneo",
        description: "Corrige qualquer bug em produção antes que o cliente perceba. Ganha o turno automaticamente se o atributo for Commits."
    },
    superTrunfoAttribute: "Estrelas"
  },
  aiImageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop"
};

const App: React.FC = () => {
  const { loading, error, profile, generateCard, setMockProfile, resetProfile } = useCardGenerator();

  const handleMock = useCallback(() => {
      setMockProfile(MOCK_PROFILE);
  }, [setMockProfile]);

  const downloadCard = async () => {
    const node = document.getElementById('dev-trunfo-card');
    if (!node) return;

    try {
        const dataUrl = await toPng(node, {
            quality: 1.0,
            pixelRatio: 3,
            cacheBust: true,
        });
        const link = document.createElement('a');
        link.download = `dev-trunfo-${profile?.user.login || 'card'}.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Download failed', err);
        alert('Failed to download image. Try again.');
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
        {!profile && !loading && (
            <>
                <div className={`transition-all duration-500 ease-in-out w-full flex justify-center`}>
                    <InputForm onSubmit={generateCard} onMock={handleMock} isLoading={loading} />
                </div>
                <p className="text-zinc-500 text-xs font-mono mt-8 text-center">
                   <span className="text-zinc-600">made with love by </span>
                   <a href="https://x.com/enrichthesoil" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                     @enrichthesoil
                   </a>
                </p>
            </>
        )}

        {/* Error Message */}
        {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-lg animate-fade-in shadow-lg text-center max-w-md">
                <p className="font-bold mb-1">⚠️ Error</p>
                <p className="text-sm">{error}</p>
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
                        onClick={resetProfile}
                        className="flex items-center justify-center gap-2 bg-zinc-800 text-zinc-300 font-bold py-3 px-8 rounded-full hover:bg-zinc-700 transition-colors border border-zinc-700"
                    >
                        <RefreshCcw size={20} /> Create New
                    </button>
                </div>
                
                <p className="text-zinc-500 text-xs font-mono mt-4 text-center">
                   Generated with Gemini 2.5 • Developed by DevTrunfo<br/>
                   <span className="text-zinc-600">made with love by </span>
                   <a href="https://x.com/enrichthesoil" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                     @enrichthesoil
                   </a>
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;
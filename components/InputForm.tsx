import React, { useState, useEffect, memo } from 'react';
import { Search, Github, Loader2, FlaskConical, Settings, Sparkles } from 'lucide-react';

interface InputFormProps {
  onSubmit: (username: string, githubToken?: string, googleApiKey?: string) => void;
  onMock: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = memo(({ onSubmit, onMock, isLoading }) => {
  const [username, setUsername] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Load tokens from local storage on mount
  useEffect(() => {
    const savedGhToken = localStorage.getItem('github_token');
    if (savedGhToken) setGithubToken(savedGhToken);

    const savedGoogleKey = localStorage.getItem('google_api_key');
    if (savedGoogleKey) setGoogleApiKey(savedGoogleKey);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Save tokens to local storage
      if (githubToken.trim()) localStorage.setItem('github_token', githubToken.trim());
      else localStorage.removeItem('github_token');

      if (googleApiKey.trim()) localStorage.setItem('google_api_key', googleApiKey.trim());
      else localStorage.removeItem('google_api_key');

      onSubmit(username.trim(), githubToken.trim(), googleApiKey.trim());
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

      <div className="flex items-center justify-between mb-4 text-white relative z-10">
        <div className="flex items-center gap-3">
            <div className="bg-zinc-800 p-2 rounded-lg">
                <Github size={24} className="text-white" />
            </div>
            <div>
                <h1 className="text-2xl font-tech font-bold tracking-wide leading-none">DevTrunfo</h1>
                <p className="text-xs text-zinc-500 font-mono">GITHUB CARD GENERATOR</p>
            </div>
        </div>
        <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-all ${showSettings ? 'bg-zinc-800 text-yellow-500' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/50'}`}
            title="Settings / API Keys"
        >
            <Settings size={18} />
        </button>
      </div>

      {/* Info banner about AI features */}
      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-700/30 rounded-lg p-3 mb-4 relative z-10">
        <div className="flex items-start gap-2">
          <Sparkles size={16} className="text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-purple-200">
            <p className="font-semibold mb-1">✨ AI-Powered Features</p>
            <p className="text-purple-300/90">
              This app uses Google Gemini AI to generate unique character art and card stats. 
              The default API key has limited quota. For unlimited usage, add your own Gemini API key in settings.
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
        
        {/* Settings / API Keys (Collapsible) */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showSettings ? 'max-h-52 opacity-100 mb-2' : 'max-h-0 opacity-0'}`}>
            <div className="bg-zinc-950/50 rounded-lg p-3 border border-zinc-800 flex flex-col gap-3">
                {/* GitHub Token */}
                <div>
                    <label className="text-[10px] text-zinc-400 font-mono mb-1 flex items-center gap-1">
                        <Github size={10} /> GITHUB TOKEN (OPTIONAL)
                    </label>
                    <input
                        type="password"
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        placeholder="ghp_..."
                        className="w-full bg-transparent border-b border-zinc-700 text-zinc-300 text-xs focus:outline-none focus:border-yellow-500 px-0 py-1 placeholder-zinc-700 transition-colors"
                    />
                    <p className="text-[9px] text-zinc-600 mt-1">
                        Increases GitHub API rate limits.
                    </p>
                </div>

                {/* Google API Key */}
                <div>
                    <label className="text-[10px] text-zinc-400 font-mono mb-1 flex items-center gap-1">
                        <Sparkles size={10} /> GEMINI API KEY (OPTIONAL)
                    </label>
                    <input
                        type="password"
                        value={googleApiKey}
                        onChange={(e) => setGoogleApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full bg-transparent border-b border-zinc-700 text-zinc-300 text-xs focus:outline-none focus:border-purple-500 px-0 py-1 placeholder-zinc-700 transition-colors"
                    />
                    <p className="text-[9px] text-zinc-600 mt-1">
                        A default key is provided but has limited quota. Add your own for unlimited AI generation.
                    </p>
                </div>
            </div>
        </div>

        <div>
            <label className="text-xs text-yellow-500 font-mono mb-1 block tracking-wider">GITHUB USERNAME</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: torvalds"
                className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all font-mono placeholder-zinc-700"
                disabled={isLoading}
            />
        </div>

        <button
          type="submit"
          disabled={isLoading || !username}
          className={`
            w-full font-bold px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-2
            bg-yellow-500 hover:bg-yellow-400 text-black hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
          `}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <><Search size={18}/> GENERATE CARD</>}
        </button>

        <button
          type="button"
          onClick={onMock}
          disabled={isLoading}
          className="w-full text-zinc-500 text-xs hover:text-white transition-colors flex items-center justify-center gap-1 py-2 mt-1"
        >
            <FlaskConical size={12} /> Test with Mock Data
        </button>
      </form>
    </div>
  );
});

InputForm.displayName = "InputForm";
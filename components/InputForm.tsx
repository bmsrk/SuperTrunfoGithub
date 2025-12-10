import React, { useState } from 'react';
import { Search, Github, Loader2 } from 'lucide-react';

interface InputFormProps {
  onSubmit: (player1: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

      <div className="flex items-center gap-3 mb-6 text-white relative z-10">
        <div className="bg-zinc-800 p-2 rounded-lg">
            <Github size={24} className="text-white" />
        </div>
        <div>
            <h1 className="text-2xl font-tech font-bold tracking-wide leading-none">DevTrunfo</h1>
            <p className="text-xs text-zinc-500 font-mono">GITHUB CARD GENERATOR</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
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
      </form>
    </div>
  );
};
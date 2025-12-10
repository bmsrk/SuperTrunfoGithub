import React, { useRef, useState, MouseEvent } from 'react';
import { CombinedProfile } from '../types';
import { Zap, Star, GitCommit, Users, BookMarked, Sparkles } from 'lucide-react';

interface CardProps {
  data: CombinedProfile;
}

export const Card: React.FC<CardProps> = ({ data }) => {
  const { user, cardData, aiImageUrl } = data;
  const cardRef = useRef<HTMLDivElement>(null);
  
  // State for 3D rotation
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  
  // State for Foil/Lighting (coordinates in percentages 0-100 and raw pixels)
  const [foil, setFoil] = useState({ x: 50, y: 50, px: 0, py: 0, opacity: 0 });

  const getIconForLabel = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('estrela') || l.includes('star')) return <Star size={12} className="text-yellow-500" />;
    if (l.includes('seguidores') || l.includes('follower')) return <Users size={12} className="text-blue-400" />;
    if (l.includes('commit')) return <GitCommit size={12} className="text-green-400" />;
    if (l.includes('repo')) return <BookMarked size={12} className="text-purple-400" />;
    return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate percentage positions
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Rotation calculation (Max 15 degrees)
    const rotateX = ((y - centerY) / centerY) * -14; 
    const rotateY = ((x - centerX) / centerX) * 14;

    setRotate({ x: rotateX, y: rotateY });
    setFoil({ x: xPct, y: yPct, px: x, py: y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setFoil((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div 
        className="perspective-1000 group"
        style={{ perspective: '1200px' }}
    >
        <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-[340px] bg-neutral-900 rounded-xl p-2 shadow-2xl transition-all duration-300 ease-out font-sans select-none border border-neutral-800"
            style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
                boxShadow: `
                    ${-rotate.y * 1.5}px ${rotate.x * 1.5}px 30px rgba(0,0,0,0.6),
                    0 0 0 1px rgba(255,255,255,0.05)
                `
            }}
        >
            {/* --- LAYERS OF HOLOGRAPHIC FOIL --- */}
            
            {/* 1. Grain Texture (Noise) - Adds physical realism */}
            <div 
                className="absolute inset-0 rounded-xl pointer-events-none z-50 opacity-[0.15] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* 2. Prismatic Color Shift (The "Rainbow" Effect) */}
            <div 
                className="absolute inset-0 rounded-xl pointer-events-none z-50 mix-blend-color-dodge transition-opacity duration-300"
                style={{
                    opacity: foil.opacity * 0.6, // Subtle base opacity
                    background: `
                        linear-gradient(
                            115deg, 
                            transparent 20%, 
                            rgba(255, 0, 128, 0.4) 35%, 
                            rgba(0, 255, 255, 0.4) 50%, 
                            rgba(255, 255, 0, 0.4) 65%, 
                            transparent 80%
                        )
                    `,
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${foil.x}% ${foil.y}%`, // Moves opposite to mouse for depth
                    filter: 'brightness(1.2) contrast(1.2)'
                }}
            />

            {/* 3. Vertical Sheen (Glossy coating reflection) */}
            <div 
                className="absolute inset-0 rounded-xl pointer-events-none z-50 mix-blend-soft-light transition-opacity duration-200"
                style={{
                    opacity: foil.opacity,
                    background: `
                        linear-gradient(
                            to right,
                            transparent,
                            rgba(255, 255, 255, 0.2) ${foil.x - 15}%,
                            rgba(255, 255, 255, 0.6) ${foil.x}%,
                            rgba(255, 255, 255, 0.2) ${foil.x + 15}%,
                            transparent
                        )
                    `
                }}
            />

            {/* 4. Specular Spotlight (Direct light source) */}
            <div 
                className="absolute inset-0 rounded-xl pointer-events-none z-50 mix-blend-overlay transition-opacity duration-200"
                style={{
                    opacity: foil.opacity,
                    background: `
                        radial-gradient(
                            600px circle at ${foil.px}px ${foil.py}px, 
                            rgba(255,255,255,0.4) 0%, 
                            transparent 40%
                        )
                    `
                }}
            />

            {/* --- ACTUAL CARD CONTENT --- */}
            <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col relative z-10 border-[3px] border-neutral-800">
                
                {/* Header Section */}
                <div className="h-10 bg-neutral-900 flex justify-between items-center px-3 shrink-0 border-b-2 border-yellow-500 relative overflow-hidden">
                    <span className="relative z-10 font-tech text-white font-bold text-lg tracking-wider uppercase">{user.login}</span>
                    <div className="relative z-10 bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded transform -skew-x-12 shadow-lg">
                        SUPER TRUNFO
                    </div>
                </div>

                {/* Image Section */}
                <div className="relative w-full aspect-square bg-neutral-100 overflow-hidden border-b-4 border-neutral-900 shrink-0">
                    <img 
                        src={aiImageUrl || user.avatar_url} 
                        alt={user.login} 
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {aiImageUrl && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[9px] px-2 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg border border-white/20">
                            <Sparkles size={10} className="text-purple-400" /> AI ART
                        </div>
                    )}
                    
                    {/* Shadow Gradient from bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-transparent to-transparent pointer-events-none"></div>

                    {/* Class Badge Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="bg-yellow-400 text-black px-3 py-1 font-tech font-bold text-sm inline-block shadow-[3px_3px_0px_rgba(0,0,0,0.8)] border border-black transform -skew-x-6">
                            {cardData.archetype}
                        </div>
                    </div>
                </div>

                {/* Name Section - Full Name */}
                <div className="bg-neutral-900 text-white py-2 px-2 text-center border-b border-neutral-700 shrink-0 relative z-20">
                    <h2 className="text-xl font-black uppercase tracking-tighter truncate font-tech text-white drop-shadow-md">
                        {user.name || user.login}
                    </h2>
                    <p className="text-gray-400 text-[9px] italic leading-tight px-4 truncate">
                        "{cardData.description}"
                    </p>
                </div>

                {/* Stats Table */}
                <div className="flex-1 bg-white flex flex-col justify-start relative">
                    {cardData.stats.map((stat, index) => {
                        const isTrunfo = cardData.superTrunfoAttribute === stat.label;
                        return (
                        <div 
                            key={index} 
                            className={`
                                relative z-10 flex justify-between items-center px-4 py-1.5
                                ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                                border-b border-gray-100 last:border-0
                            `}
                        >
                            <div className="flex items-center gap-2">
                                {getIconForLabel(stat.label)}
                                <span className="text-gray-600 font-bold text-[10px] uppercase font-tech tracking-wider">
                                    {stat.label}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {isTrunfo && (
                                    <span className="bg-yellow-500 text-black text-[9px] font-bold px-1 rounded animate-pulse">TRUNFO</span>
                                )}
                                <span className={`font-black text-sm font-mono ${isTrunfo ? 'text-yellow-600 scale-110' : 'text-neutral-800'}`}>
                                    {stat.value}{stat.unit}
                                </span>
                            </div>
                        </div>
                    )})}
                </div>

                {/* Special Ability Section */}
                <div className="bg-neutral-900 p-3 border-t-4 border-yellow-500 shrink-0 relative overflow-hidden flex flex-col justify-center min-h-[85px]">
                    <div className="absolute right-[-10px] bottom-[-20px] text-yellow-500/5 transform rotate-12">
                        <Zap size={80} />
                    </div>

                    <div className="flex items-center gap-2 mb-1 relative z-10">
                        <div className="bg-yellow-500 text-black p-0.5 rounded shadow-lg shadow-yellow-500/20">
                            <Zap size={12} fill="black" />
                        </div>
                        <h3 className="text-yellow-400 font-tech font-bold text-xs uppercase tracking-widest shadow-black drop-shadow-md">
                            {cardData.specialAbility.name}
                        </h3>
                    </div>
                    <p className="text-gray-300 text-[9px] leading-relaxed font-mono relative z-10 pl-2 border-l border-gray-700 ml-1">
                        {cardData.specialAbility.description}
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

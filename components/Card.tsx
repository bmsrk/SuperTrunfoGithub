import React, { useRef, MouseEvent, memo } from 'react';
import { CombinedProfile } from '../types';
import { Zap, Star, GitCommit, Users, BookMarked, Sparkles } from 'lucide-react';

interface CardProps {
  data: CombinedProfile;
}

export const Card: React.FC<CardProps> = memo(({ data }) => {
  const { user, cardData, aiImageUrl } = data;
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const requestId = useRef<number | null>(null);

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
    
    if (requestId.current) cancelAnimationFrame(requestId.current);

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    requestId.current = requestAnimationFrame(() => {
        const xPct = (x / rect.width) * 100;
        const yPct = (y / rect.height) * 100;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Increased sensitivity for a "heavier" 3D feel
        const rotateX = ((y - centerY) / centerY) * -25; 
        const rotateY = ((x - centerX) / centerX) * 25;

        // Calculate distance from center for intensity
        const distance = Math.sqrt(Math.pow((x - centerX) / centerX, 2) + Math.pow((y - centerY) / centerY, 2));
        const intensity = Math.min(1, distance * 1.5);

        // Update CSS Variables
        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);
        
        // Dynamic Foil Position - Moves faster than card to simulate light travel
        card.style.setProperty('--foil-x', `${50 + (xPct - 50) * 1.5}%`);
        card.style.setProperty('--foil-y', `${50 + (yPct - 50) * 1.5}%`);
        
        // Sheen Position - Diagonal sweep
        card.style.setProperty('--sheen-position', `${xPct + yPct * 0.5}%`);
        
        // Spotlight/Glare position
        card.style.setProperty('--pointer-x', `${xPct}%`);
        card.style.setProperty('--pointer-y', `${yPct}%`);
        
        // Opacity/Intensity
        card.style.setProperty('--card-opacity', '1');
        card.style.setProperty('--foil-intensity', `${0.2 + (intensity * 0.5)}`); // Reduced base intensity
        
        // Deep Parallax
        card.style.setProperty('--parallax-x', `${((x - centerX) / centerX) * -40}px`);
        card.style.setProperty('--parallax-y', `${((y - centerY) / centerY) * -40}px`);
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    if (requestId.current) cancelAnimationFrame(requestId.current);

    requestId.current = requestAnimationFrame(() => {
        const card = cardRef.current!;
        card.style.setProperty('--rotate-x', '0deg');
        card.style.setProperty('--rotate-y', '0deg');
        card.style.setProperty('--card-opacity', '0');
        card.style.setProperty('--foil-intensity', '0');
        card.style.setProperty('--parallax-x', '0px');
        card.style.setProperty('--parallax-y', '0px');
        card.style.setProperty('--foil-x', '50%');
        card.style.setProperty('--foil-y', '50%');
        card.style.setProperty('--pointer-x', '50%');
        card.style.setProperty('--pointer-y', '50%');
    });
  };

  const noiseSVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E`;

  return (
    <div className="perspective-1000 group z-50" style={{ perspective: '600px' }}>
        <div 
            id="dev-trunfo-card"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-[340px] rounded-xl transition-all duration-300 ease-out font-sans select-none will-change-transform transform-gpu"
            style={{
                transform: 'rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
                boxShadow: 'rgba(0,0,0,0.6) calc(var(--rotate-y, 0) * -1px) calc(var(--rotate-x, 0) * 1px) 30px, 0 0 0 1px rgba(255,255,255,0.05)'
            } as React.CSSProperties}
        >
            {/* 0. Outer Backlight Glow - Pulsing Legendary Effect */}
            <div 
                ref={glowRef}
                className="absolute -inset-[4px] rounded-xl bg-gradient-to-tr from-yellow-600/0 via-yellow-500/50 to-purple-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                style={{ zIndex: -1 }}
            ></div>

            {/* MAIN CARD CONTAINER */}
            <div className="relative w-full h-full bg-neutral-900 rounded-xl p-2.5 border border-neutral-800 overflow-hidden">

                {/* --- HYPER-FOIL LAYERS --- */}
                
                {/* 1. Physical Grain Texture */}
                <div 
                    className="absolute inset-0 rounded-xl pointer-events-none z-50 mix-blend-overlay"
                    style={{ backgroundImage: `url("${noiseSVG}")` }}
                />

                {/* 2. Glossy Coating (The Sheen) - Soft Light for transparency */}
                <div 
                    className="absolute inset-0 rounded-xl pointer-events-none z-50 mix-blend-soft-light transition-opacity duration-100"
                    style={{
                        opacity: 'calc(var(--card-opacity, 0) * 0.6)',
                        background: `linear-gradient(
                            105deg, 
                            transparent 20%, 
                            rgba(255, 255, 255, 0.4) 40%, 
                            rgba(255, 255, 255, 0.7) 50%, 
                            rgba(255, 255, 255, 0.4) 60%, 
                            transparent 80%
                        )`,
                        backgroundPosition: 'var(--sheen-position, 0%) 0%',
                        backgroundSize: '200% 100%'
                    } as React.CSSProperties}
                />

                {/* 3. Prismatic Hologram (MTG Style) - Color Dodge + Low Opacity */}
                <div 
                    className="absolute inset-0 rounded-xl pointer-events-none z-50 mix-blend-color-dodge transition-opacity duration-100"
                    style={{
                        opacity: 'calc(var(--card-opacity, 0) * var(--foil-intensity, 0.3))',
                        background: `
                            conic-gradient(
                                from var(--rotate-y, 0deg) at var(--foil-x, 50%) var(--foil-y, 50%),
                                transparent 0deg,
                                rgba(255, 0, 150, 0.4) 60deg,
                                rgba(0, 200, 255, 0.4) 120deg,
                                rgba(255, 255, 0, 0.4) 180deg,
                                rgba(0, 200, 255, 0.4) 240deg,
                                rgba(255, 0, 150, 0.4) 300deg,
                                transparent 360deg
                            )
                        `,
                        filter: 'blur(15px)',
                    } as React.CSSProperties}
                />

                 {/* 4. Specular Flash - Crisp reflection of light source */}
                 <div 
                    className="absolute inset-0 rounded-xl pointer-events-none z-50 mix-blend-overlay transition-opacity duration-100"
                    style={{
                        opacity: 'calc(var(--card-opacity, 0) * 0.8)',
                        background: `
                            radial-gradient(
                                circle at var(--pointer-x, 50%) var(--pointer-y, 50%), 
                                rgba(255,255,255,0.9) 0%, 
                                rgba(255,255,255,0.3) 25%, 
                                transparent 60%
                            )
                        `
                    } as React.CSSProperties}
                />

                {/* --- CONTENT --- */}
                <div className="w-full h-full bg-neutral-100 rounded-lg overflow-hidden flex flex-col relative z-10 border-[3px] border-neutral-800 shadow-inner">
                    
                    {/* Header */}
                    <div className="h-11 bg-neutral-900 flex justify-between items-center px-4 shrink-0 border-b-2 border-yellow-500 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] group-hover:animate-[shine_3s_infinite]"></div>
                        <span className="relative z-10 font-tech text-white font-bold text-lg tracking-wider uppercase truncate max-w-[200px]">{user.login}</span>
                        <div className="relative z-10 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded transform -skew-x-12 shadow-[2px_2px_0px_rgba(0,0,0,0.5)] border border-yellow-400">
                            SUPER TRUNFO
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="relative w-full aspect-square bg-neutral-900 overflow-hidden border-b-[5px] border-neutral-900 shrink-0 group-hover:shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                        <img 
                            src={aiImageUrl || user.avatar_url} 
                            alt={user.login} 
                            crossOrigin="anonymous"
                            decoding="async"
                            loading="eager"
                            className="w-full h-full object-cover object-top will-change-transform transition-transform duration-100"
                            style={{
                                transform: 'translate(var(--parallax-x, 0px), var(--parallax-y, 0px)) scale(1.35)'
                            } as React.CSSProperties}
                        />
                        
                        {aiImageUrl && (
                            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-lg border border-white/20 z-20">
                                <Sparkles size={10} className="text-purple-400" /> AI ART
                            </div>
                        )}
                        
                        {/* Dramatic Shadow Gradient from Bottom */}
                        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent pointer-events-none z-10"></div>

                        {/* Archetype Badge */}
                        <div className="absolute bottom-3 left-0 px-3 z-20 w-full">
                            <div className="bg-yellow-400 text-black px-3 py-1 font-tech font-bold text-sm inline-block shadow-[4px_4px_0px_rgba(0,0,0,0.8)] border-2 border-black transform -skew-x-6">
                                {cardData.archetype}
                            </div>
                        </div>
                    </div>

                    {/* Name & Desc */}
                    <div className="bg-neutral-900 text-white py-2.5 px-3 text-center border-b border-neutral-700 shrink-0 relative z-20 flex flex-col items-center shadow-lg">
                        <h2 className="text-lg font-black uppercase tracking-tight truncate font-tech text-white drop-shadow-[0_2px_0_rgba(0,0,0,1)] w-full mb-1">
                            {user.name || user.login}
                        </h2>
                        <p className="text-gray-400 text-[10px] leading-3 px-2 line-clamp-2 min-h-[24px] flex items-center justify-center text-center font-mono w-full">
                            "{cardData.description}"
                        </p>
                    </div>

                    {/* Stats Table */}
                    <div className="flex-1 bg-zinc-100 flex flex-col justify-start relative divide-y divide-zinc-200">
                        {cardData.stats.map((stat, index) => {
                            const isTrunfo = cardData.superTrunfoAttribute === stat.label;
                            return (
                            <div 
                                key={index} 
                                className={`
                                    relative z-10 flex justify-between items-center px-4 py-1.5
                                    ${index % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}
                                    transition-colors hover:bg-yellow-50
                                `}
                            >
                                <div className="flex items-center gap-2">
                                    {getIconForLabel(stat.label)}
                                    <span className="text-zinc-600 font-bold text-[10px] uppercase font-tech tracking-wider">
                                        {stat.label}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    {isTrunfo && (
                                        <span className="bg-yellow-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm animate-pulse">TRUNFO</span>
                                    )}
                                    <span className={`font-black text-sm font-mono ${isTrunfo ? 'text-yellow-600 scale-105' : 'text-zinc-800'}`}>
                                        {stat.value}{stat.unit}
                                    </span>
                                </div>
                            </div>
                        )})}
                    </div>

                    {/* Special Ability */}
                    <div className="bg-neutral-800 p-3 border-t-[3px] border-yellow-500 shrink-0 relative overflow-hidden flex flex-col justify-center min-h-[85px]">
                        {/* Background Icon */}
                        <div className="absolute right-[-15px] bottom-[-25px] text-white/5 transform rotate-12 pointer-events-none">
                            <Zap size={90} strokeWidth={1} />
                        </div>

                        <div className="flex items-center gap-2 mb-1.5 relative z-10">
                            <div className="bg-yellow-500 text-black p-0.5 rounded shadow shadow-yellow-500/20">
                                <Zap size={10} fill="black" />
                            </div>
                            <h3 className="text-yellow-400 font-tech font-bold text-xs uppercase tracking-widest drop-shadow-md">
                                {cardData.specialAbility.name}
                            </h3>
                        </div>
                        <p className="text-zinc-400 text-[9px] leading-relaxed font-mono relative z-10 pl-2 border-l-2 border-yellow-500/30 ml-1">
                            {cardData.specialAbility.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
});

Card.displayName = "Card";
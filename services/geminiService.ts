import { GoogleGenAI, Type } from "@google/genai";
import { GithubUser, CardData } from '../types';

// ============================================================================
// DETERMINISTIC LOCAL GENERATOR (NO EXTERNAL API REQUIRED)
// ============================================================================

/**
 * djb2 hash function - creates a deterministic integer from a string
 * This is a simple, fast hash function suitable for seeding PRNGs
 */
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); // hash * 33 + c
  }
  return Math.abs(hash);
}

/**
 * Mulberry32 PRNG - deterministic pseudo-random number generator
 * Given the same seed, it will always produce the same sequence of numbers
 */
function createSeededRandom(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Weighted random choice - selects an item based on weights using deterministic RNG
 */
function weightedChoice<T>(items: T[], weights: number[], rng: () => number): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = rng() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  return items[items.length - 1];
}

/**
 * Normalize a value to 1-100 range using logarithmic scaling
 */
function normalizeToRange(value: number, min: number, max: number, variance: number = 0): number {
  if (value <= 0) return Math.max(1, Math.floor(1 + variance));
  
  // Use log scale for better distribution
  const logValue = Math.log10(value + 1);
  const logMax = Math.log10(max + 1);
  const logMin = Math.log10(min + 1);
  
  const normalized = ((logValue - logMin) / (logMax - logMin)) * 99 + 1;
  const result = Math.min(100, Math.max(1, Math.floor(normalized + variance)));
  
  return result;
}

/**
 * Deterministic local card stats generator
 * Uses GitHub data to create a unique fingerprint and generates consistent results
 * 
 * @param user - GitHub user profile
 * @param repoSummary - Repository summary data
 * @returns CardData with deterministic stats
 */
export const generateLocalCardStats = (
  user: GithubUser,
  repoSummary: { 
    topLanguages: string[], 
    totalStars: number, 
    totalForks: number,
    repoCount: number,
    allTopics: string[],
    repoNames: string[],
    repoDescriptions: string[],
    originalRepoCount: number
  }
): CardData => {
  // Create a unique fingerprint from user data
  const topLangs = repoSummary.topLanguages.slice(0, 3).join(',');
  const topTopics = repoSummary.allTopics.slice(0, 6).join(',');
  const fingerprint = `${user.login}|${user.public_repos}|${repoSummary.totalStars}|${user.followers}|${topLangs}|${topTopics}`;
  
  // Generate deterministic seed from fingerprint
  const seed = djb2Hash(fingerprint);
  const rng = createSeededRandom(seed);
  
  // Calculate metrics
  const accountAge = Math.max(1, new Date().getFullYear() - new Date(user.created_at).getFullYear());
  const estimatedCommits = user.public_repos * 60 + accountAge * 400 + repoSummary.totalStars * 2 + repoSummary.originalRepoCount * 30;
  
  // Normalize stats with small deterministic variance
  const reposNorm = normalizeToRange(user.public_repos, 0, 500, (rng() - 0.5) * 10);
  const starsNorm = normalizeToRange(repoSummary.totalStars, 0, 5000, (rng() - 0.5) * 10);
  const followersNorm = normalizeToRange(user.followers, 0, 1000, (rng() - 0.5) * 10);
  const commitsNorm = normalizeToRange(estimatedCommits, 0, 50000, (rng() - 0.5) * 10);
  
  // Keep raw values for display but use normalized for comparisons
  const stats = [
    { label: 'Repositórios', value: user.public_repos, normalized: reposNorm },
    { label: 'Estrelas', value: repoSummary.totalStars, normalized: starsNorm },
    { label: 'Seguidores', value: user.followers, normalized: followersNorm },
    { label: 'Commits', value: estimatedCommits, unit: '+', normalized: commitsNorm }
  ];
  
  // Select trump based on highest normalized stat with small chance of randomness
  const maxStat = rng() > 0.9 
    ? stats[Math.floor(rng() * stats.length)]
    : stats.reduce((max, stat) => (stat.normalized || 0) > (max.normalized || 0) ? stat : max, stats[0]);
  
  // Archetype selection based on heuristics
  const topLang = repoSummary.topLanguages[0] || 'Code';
  const hasLocation = !!user.location;
  const hasCompany = !!user.company;
  const isProlific = user.public_repos > 30;
  const isPopular = user.followers > 100;
  
  // Language-based archetype base
  const langArchetypes: Record<string, string[]> = {
    'JavaScript': ['Frontend Alchemist', 'Script Sorcerer', 'Web Enchanter'],
    'TypeScript': ['Type-Safe Paladin', 'Interface Guardian', 'Typed Warrior'],
    'Python': ['Data Sorcerer', 'Script Wizard', 'Algorithm Sage'],
    'Java': ['Enterprise Architect', 'JVM Titan', 'Bean Master'],
    'Go': ['Concurrency Master', 'Goroutine Shepherd', 'Cloud Native'],
    'Rust': ['Memory Guardian', 'Safe Code Sentinel', 'Systems Artisan'],
    'C++': ['Performance Ninja', 'Low-Level Samurai', 'Cache Optimizer'],
    'C#': ['Framework Wizard', 'LINQ Sorcerer', '.NET Architect'],
    'Ruby': ['Rails Conductor', 'Gem Curator', 'Meta-Programming Mage'],
    'PHP': ['Web Craftsman', 'Server-Side Sage', 'Dynamic Weaver'],
    'Swift': ['iOS Architect', 'SwiftUI Master', 'Apple Ecosystem Lord'],
    'Kotlin': ['Android Artisan', 'Coroutine Commander', 'JetBrains Virtuoso'],
    'Dart': ['Flutter Champion', 'Widget Wizard', 'Cross-Platform Sage'],
    'R': ['Statistical Sage', 'Data Visualizer', 'Research Wizard'],
    'Shell': ['Terminal Virtuoso', 'Script Automator', 'CLI Champion']
  };
  
  const archetypeOptions = langArchetypes[topLang] || [`${topLang} Developer`, `${topLang} Expert`, `${topLang} Master`];
  
  // Weight archetypes based on user profile
  let weights = [1, 1, 1];
  if (isProlific) weights[0] *= 1.5;
  if (isPopular) weights[1] *= 1.5;
  if (hasCompany || hasLocation) weights[2] *= 1.5;
  
  const archetype = weightedChoice(archetypeOptions, weights, rng);
  
  // Generate description based on real data
  const descriptionParts: string[] = [];
  
  if (user.bio && user.bio.length > 10) {
    descriptionParts.push(`"${user.bio.substring(0, 50)}${user.bio.length > 50 ? '...' : ''}"`);
  }
  
  if (user.location) {
    descriptionParts.push(`De ${user.location}`);
  }
  
  if (repoSummary.totalStars > 100) {
    descriptionParts.push(`${repoSummary.totalStars}⭐ conquistadas`);
  }
  
  if (user.followers > 50) {
    descriptionParts.push(`${user.followers} seguidores`);
  }
  
  if (isProlific) {
    descriptionParts.push(`${user.public_repos} repositórios`);
  }
  
  if (repoSummary.allTopics.length > 0) {
    const topic = repoSummary.allTopics[Math.floor(rng() * Math.min(3, repoSummary.allTopics.length))];
    descriptionParts.push(`especialista em ${topic}`);
  }
  
  const description = descriptionParts.length > 0 
    ? descriptionParts.slice(0, 3).join('. ') + '.'
    : `Desenvolvedor ${topLang} com ${accountAge} anos de experiência no GitHub.`;
  
  // Special ability based on profile and highest stat
  const abilityOptions: Array<{name: string, description: string, weight: number}> = [];
  
  if (topLang === 'Python' || repoSummary.allTopics.some(t => t.includes('machine-learning') || t.includes('data'))) {
    abilityOptions.push({
      name: 'Neural Net Deploy',
      description: `Multiplica Commits por ${Math.ceil(rng() * 2 + 1)} se for o trunfo.`,
      weight: 2
    });
  }
  
  if (topLang === 'JavaScript' || topLang === 'TypeScript' || repoSummary.allTopics.some(t => t.includes('react') || t.includes('frontend'))) {
    abilityOptions.push({
      name: 'Virtual DOM Storm',
      description: `Adiciona ${Math.floor(rng() * 20 + 10)} pontos a Estrelas.`,
      weight: 2
    });
  }
  
  if (repoSummary.totalStars > 500) {
    abilityOptions.push({
      name: 'Open Source Legend',
      description: 'Dobra o valor de Estrelas se for o trunfo.',
      weight: 3
    });
  }
  
  if (user.followers > 200) {
    abilityOptions.push({
      name: 'Community Magnet',
      description: 'Ganha automaticamente se Seguidores for maior que o oponente.',
      weight: 3
    });
  }
  
  if (hasCompany) {
    abilityOptions.push({
      name: 'Enterprise Power',
      description: 'Anula habilidades especiais de oponentes com menos repositórios.',
      weight: 2
    });
  }
  
  // Default abilities
  abilityOptions.push(
    { name: 'Git Push --force', description: 'Dobra o valor de Commits se for o trunfo.', weight: 1 },
    { name: 'Merge Master', description: 'Ganha se tiver mais repositórios que o oponente.', weight: 1 },
    { name: 'Code Review Pro', description: 'Anula o trunfo do oponente se tiver mais estrelas.', weight: 1 },
    { name: 'Sudo Deploy', description: 'Troca valores de Seguidores com o oponente.', weight: 1 }
  );
  
  const specialAbility = weightedChoice(
    abilityOptions,
    abilityOptions.map(a => a.weight),
    rng
  );
  
  // Generate ID deterministically
  const idNum = (seed % 99) + 1;
  
  return {
    id: `DEV-${idNum.toString().padStart(2, '0')}`,
    archetype,
    description,
    stats: stats.map(({ normalized, ...rest }) => rest), // Remove normalized from output
    specialAbility: { name: specialAbility.name, description: specialAbility.description },
    superTrunfoAttribute: maxStat.label
  };
};

// Static constants defined outside function scope to prevent reallocation
const ART_STYLES = [
    "Cyberpunk 2077 aesthetic, neon-noir, high contrast, chromatic aberration",
    "Ethereal High Fantasy, oil painting style, magical lighting, intricate details",
    "Solarpunk, organic tech, bright and hopeful, nature merging with machine",
    "Dark Synthwave, retro-futuristic, grid lines, purple and teal, VHS grain",
    "Abstract Glitch Art, digital distortion, data moshing, avant-garde",
    "Steampunk, brass gears, steam, victorian industrial, copper tones",
    "Sci-fi Minimalism, clean lines, white and chrome, cinematic lighting",
    "Digital Watercolor, soft edges, artistic, flowy, dreamlike",
    "Gothic Horror Tech, dark, moody, red glowing eyes, biomechanical cables",
    "Retro 80s Anime style, cel-shaded, vibrant colors, dramatic angles"
];

const ENVIRONMENTS = [
    "surrounded by floating holographic code screens",
    "inside a massive futuristic server room with infinite lights",
    "standing on a digital mountain peak overlooking a city of data",
    "in an ancient library where books are made of glowing circuit boards",
    "floating in the void of cyberspace with binary rain falling",
    "sitting on a throne made of motherboards and thick cables",
    "in a high-tech laboratory with floating robot assistants",
    "in a cosmic nebula formed by constellations of nodes and graphs"
];

const POWER_ELEMENTS = [
    "wielding a glowing keyboard like a powerful weapon",
    "controlling streams of binary code with their bare hands",
    "with mechanical augmentations glowing with raw energy",
    "surrounded by orbiting data crystals and floating runes",
    "wearing a hoodie that obscures the face with shadow and scrolling code",
    "with a digital aura manifesting as a spectral animal",
    "typing rapidly on a holographic interface that surrounds them"
];

const extractImageFromResponse = (response: any): string | null => {
    console.debug("Extracting image from AI response:", JSON.stringify(response, null, 2));
    for (const candidate of response.candidates || []) {
        for (const part of candidate.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    return null;
};

export const generateCardStats = async (
  user: GithubUser,
  repoSummary: { 
    topLanguages: string[], 
    totalStars: number, 
    totalForks: number,
    repoCount: number,
    allTopics: string[],
    repoNames: string[],
    repoDescriptions: string[],
    originalRepoCount: number
  },
  apiKey?: string
): Promise<CardData> => {
  // If no API key is provided, use the local deterministic generator
  if (!apiKey || !apiKey.trim()) {
    console.log('No external API key provided - using local deterministic generator');
    return generateLocalCardStats(user, repoSummary);
  }

  // Try to use external AI service with the provided key
  let ai;
  try {
    ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  } catch (error) {
    console.warn('Failed to initialize AI service, falling back to local generator:', error);
    return generateLocalCardStats(user, repoSummary);
  }
  
  // Extract insights from user profile
  const accountAge = new Date().getFullYear() - new Date(user.created_at).getFullYear();
  const hasStrongBio = user.bio && user.bio.length > 20;
  const isPopular = user.followers > 50;
  const isProlific = user.public_repos > 20;
  const isActiveContributor = repoSummary.totalStars > 100 || repoSummary.totalForks > 20;
  
  // Build a rich context string with assumptions
  const contextualInsights = [];
  
  if (user.location) contextualInsights.push(`Localização: ${user.location}`);
  if (user.company) contextualInsights.push(`Empresa/Organização: ${user.company}`);
  if (user.twitter_username) contextualInsights.push(`Ativo em redes sociais (@${user.twitter_username})`);
  if (user.blog) contextualInsights.push(`Mantém blog/site: ${user.blog}`);
  if (user.hireable) contextualInsights.push(`Aberto a oportunidades`);
  
  if (repoSummary.allTopics.length > 0) {
    contextualInsights.push(`Interesses/Tópicos: ${repoSummary.allTopics.slice(0, 5).join(', ')}`);
  }
  
  if (repoSummary.repoNames.length > 0) {
    contextualInsights.push(`Projetos notáveis: ${repoSummary.repoNames.join(', ')}`);
  }
  
  if (repoSummary.repoDescriptions.length > 0) {
    contextualInsights.push(`Descrições de projetos: "${repoSummary.repoDescriptions.join('"; "')}"`);
  }
  
  const prompt = `
    Aja como um gerador CRIATIVO de cartas para o jogo "Super Trunfo" edição Desenvolvedores.
    Analise profundamente o perfil GitHub abaixo e FAÇA SUPOSIÇÕES OUSADAS sobre a personalidade e estilo do desenvolvedor.
    
    REGRA CRÍTICA: NUNCA use frases ou termos genéricos como "commits code with precision", "turns coffee into code", 
    "debugging is their superpower", "writes clean code", "architect of elegant solutions", etc.
    
    SEJA EXTREMAMENTE ESPECÍFICO usando os dados reais fornecidos abaixo.

    Perfil do Usuário:
    - Username: ${user.login}
    - Nome: ${user.name || 'Não informado'}
    - Bio: ${user.bio || 'Sem bio (desenvolve em silêncio, deixa o código falar)'}
    - Repositórios Públicos: ${user.public_repos} (amostra de ${repoSummary.repoCount}: ${repoSummary.originalRepoCount} originais, ${repoSummary.repoCount - repoSummary.originalRepoCount} forks)
    - Seguidores: ${user.followers}
    - Seguindo: ${user.following}
    - Conta criada em: ${user.created_at} (${accountAge} anos de experiência no GitHub)
    ${contextualInsights.length > 0 ? '\nContexto Adicional:\n' + contextualInsights.map(i => `- ${i}`).join('\n') : ''}
    
    Atividade de Código:
    - Linguagens Principais: ${repoSummary.topLanguages.join(', ') || 'Polímata de múltiplas tecnologias'}
    - Total Estrelas: ${repoSummary.totalStars}
    - Total Forks: ${repoSummary.totalForks}

    ANÁLISE DE PERSONALIDADE (Use isto OBRIGATORIAMENTE para criar o archetype e description):
    ${hasStrongBio ? '- Perfil bem documentado, provavelmente comunicativo e atento a detalhes' : '- Perfil minimalista, deixa o código falar por si'}
    ${isPopular ? '- Reconhecido pela comunidade, líder de opinião' : '- Foca no trabalho, não na fama'}
    ${isProlific ? '- Extremamente produtivo, provavelmente trabalha em múltiplos projetos' : '- Foca em qualidade sobre quantidade'}
    ${isActiveContributor ? '- Projetos com alto engajamento, código que inspira outros' : '- Desenvolvedor independente ou em projetos privados'}
    ${user.company ? `- Trabalha em ${user.company}, traz experiência corporativa` : '- Desenvolvedor independente ou freelancer'}
    ${user.location ? `- Baseado em ${user.location}, pode ter influências culturais locais` : ''}

    REQUISITOS OBRIGATÓRIOS DE SAÍDA (JSON):

    1. 'archetype': Crie uma classe de RPG ÚNICA e ESPECÍFICA baseada nos dados REAIS acima. 
       PROIBIDO usar apenas o nome da linguagem. Você DEVE mesclar múltiplos aspectos:
       - Se tem localização: incorpore elemento cultural (ex: "Capoeirista do React", "Samurai TypeScript")
       - Se tem tópicos específicos: use-os (ex: "Alquimista de ${repoSummary.allTopics[0] || 'APIs'}")
       - Se trabalha em empresa: mencione contexto (ex: "Arquiteto ${user.company} de ${repoSummary.topLanguages[0]}")
       - Se tem muitos repos: "Polímata", "Mestre Multi-Stack"
       - Se ML/AI/Data Science: "Cientista", "Bruxo", "Mago da IA", "Domador de Dados"
       - COMBINE múltiplos elementos: localização + tecnologia + personalidade
       
       EXEMPLOS ESPECÍFICOS OBRIGATÓRIOS para ${user.login}:
       - Se brasileiro + React: "Capoeirista do React", "Sambista Full-Stack"
       - Se japonês + qualquer tech: "Samurai de ${repoSummary.topLanguages[0] || 'Código'}"
       - Se europeu + Python: "Alquimista Europeu de Dados"
       - Se company like Google/Meta/etc: "Titã ${user.company} de ${repoSummary.topLanguages[0]}"
    
    2. 'description': OBRIGATÓRIO referenciar DADOS ESPECÍFICOS REAIS do perfil:
       - Se tem BIO: use parte dela literalmente: "${user.bio ? `"${user.bio.substring(0, 60)}..."` : ''}"
       - Se tem LOCALIZAÇÃO: mencione explicitamente: "De ${user.location || ''}"
       - Se tem EMPRESA: mencione: "Em ${user.company || ''}"
       - Se tem TÓPICOS: referencie: "Especialista em ${repoSummary.allTopics.slice(0, 2).join(' e ') || ''}"
       - Se tem PROJETOS: cite nome de projeto: "Criador de ${repoSummary.repoNames[0] || ''}"
       - Combine com números reais: "${user.followers} seguidores", "${repoSummary.totalStars} estrelas"
       
       PROIBIDO: frases vagas como "cria projetos", "código elegante", "desenvolve com paixão"
       OBRIGATÓRIO: frases com NOMES, NÚMEROS, LUGARES específicos do perfil
    
    3. 'stats': Array com exatamente 4 atributos OBRIGATÓRIOS.
       - Use estes nomes exatos: 'Repositórios', 'Estrelas', 'Seguidores', 'Commits'.
       - Valores: 
         * Use os números reais para Repositórios, Estrelas, Seguidores.
         * Para 'Commits', estime usando esta fórmula: (public_repos * 60 + anos_conta * 400 + totalStars * 2 + originalRepoCount * 30).
         Essa fórmula assume ~60 commits por repo, ~400 commits por ano de atividade, bonus por estrelas recebidas, e bonus por repos originais.
    
    4. 'superTrunfoAttribute': Escolha o atributo numérico mais impressionante para ser o trunfo.
    
    5. 'specialAbility': Um objeto com 'name' e 'description' ESPECÍFICOS ao perfil.
       O NOME deve referenciar dados reais:
         * Se Python/Jupyter/Data Science: "DataFrame Overflow", "Neural Net ${repoSummary.totalStars > 100 ? 'Master' : 'Deploy'}"
         * Se React/Vue/Frontend: "Virtual DOM ${isProlific ? 'Storm' : 'Mastery'}", "Component Tree ${user.followers > 100 ? 'Legend' : 'Fury'}"
         * Se tem muitas estrelas (>500): "Open Source ${repoSummary.totalStars > 1000 ? 'Titan' : 'Legend'}", "Community ${user.followers > 500 ? 'Icon' : 'Magnet'}"
         * Se empresa grande (Google, Meta, etc): "Enterprise ${user.company} Power", "Scrum Sprint ${isProlific ? 'God' : 'Lord'}"
         * Se localização específica: incorpore cultura local (Brasil: "Jeitinho Brasileiro", Japão: "Bushido Code")
       A descrição deve usar números reais: "Multiplica Commits por ${Math.floor(user.public_repos / 10)} se for o trunfo"
    
    6. 'id': Gere um código como "DEV-XX" onde XX é um número entre 01-99.

    INSTRUÇÕES FINAIS CRÍTICAS:
    - Você DEVE mencionar pelo menos 3 dados específicos reais (nome de projeto, localização, empresa, tópico, número de stars/followers, etc)
    - Você ESTÁ PROIBIDO de usar frases genéricas que poderiam se aplicar a qualquer desenvolvedor
    - Cada carta DEVE ser absolutamente única baseada nos dados fornecidos
    - Se não houver dados suficientes, faça suposições ousadas mas específicas baseadas no que existe
    
    Responda APENAS com o JSON válido seguindo o schema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          archetype: { type: Type.STRING },
          description: { type: Type.STRING },
          specialAbility: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ['name', 'description']
          },
          stats: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.NUMBER },
                unit: { type: Type.STRING, nullable: true }
              },
              required: ['label', 'value']
            }
          },
          superTrunfoAttribute: { type: Type.STRING }
        },
        required: ['id', 'archetype', 'description', 'stats', 'superTrunfoAttribute', 'specialAbility']
      }
    }
  });

  if (!response.text) {
    console.warn('AI service returned no text, falling back to local generator');
    return generateLocalCardStats(user, repoSummary);
  }

  try {
    return JSON.parse(response.text) as CardData;
  } catch (error) {
    console.warn('Failed to parse AI response, falling back to local generator:', error);
    return generateLocalCardStats(user, repoSummary);
  }
};

export const generateCharacterImage = async (
    imageData: { base64: string; mimeType: string } | null, 
    archetype: string, 
    primaryLang: string,
    user: GithubUser,
    topics: string[],
    apiKey?: string
): Promise<string | undefined> => {
    // Only attempt AI image generation if an external API key is explicitly provided
    if (!apiKey || !apiKey.trim()) {
        console.log('No external API key provided - skipping AI image generation');
        return undefined;
    }

    let ai;
    try {
        ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    } catch (error) {
        console.warn('Failed to initialize AI service for image generation:', error);
        return undefined;
    }
    
    // Select random elements from static arrays
    const randomStyle = ART_STYLES[Math.floor(Math.random() * ART_STYLES.length)];
    const randomEnv = ENVIRONMENTS[Math.floor(Math.random() * ENVIRONMENTS.length)];
    const randomElement = POWER_ELEMENTS[Math.floor(Math.random() * POWER_ELEMENTS.length)];

    // Build contextual details for more personalized imagery
    const contextDetails = [];
    
    // Location-based visual cues
    if (user.location) {
        const loc = user.location.toLowerCase();
        if (loc.includes('japan') || loc.includes('tokyo')) {
            contextDetails.push('with subtle Japanese aesthetic elements');
        } else if (loc.includes('brazil') || loc.includes('brasil')) {
            contextDetails.push('with vibrant Brazilian color influences');
        } else if (loc.includes('india')) {
            contextDetails.push('with rich, colorful Indian-inspired patterns');
        } else if (loc.includes('europe') || loc.includes('london') || loc.includes('berlin')) {
            contextDetails.push('with European architectural elements in background');
        }
    }
    
    // Tech stack visual hints
    if (primaryLang) {
        const lang = primaryLang.toLowerCase();
        if (lang.includes('python')) {
            contextDetails.push('with serpentine or data visualization motifs');
        } else if (lang.includes('rust')) {
            contextDetails.push('with metallic, gear-based elements');
        } else if (lang.includes('go')) {
            contextDetails.push('with minimalist, clean design elements');
        } else if (lang.includes('javascript') || lang.includes('typescript')) {
            contextDetails.push('with dynamic, flowing script patterns');
        }
    }
    
    // Interest-based details from topics
    if (topics.length > 0) {
        const topicStr = topics.join(' ').toLowerCase();
        if (topicStr.includes('machine-learning') || topicStr.includes('ai') || topicStr.includes('neural')) {
            contextDetails.push('surrounded by neural network visualizations');
        } else if (topicStr.includes('game') || topicStr.includes('unity')) {
            contextDetails.push('with gaming aesthetic elements');
        } else if (topicStr.includes('blockchain') || topicStr.includes('crypto')) {
            contextDetails.push('with blockchain/cryptographic visual elements');
        } else if (topicStr.includes('security') || topicStr.includes('cybersecurity')) {
            contextDetails.push('with hacker/security themed elements');
        }
    }

    // Construct a rich, dynamic prompt
    const basePrompt = `
        Character Class: ${archetype}
        Primary Coding Language/Theme: ${primaryLang}
        ${user.bio ? `Personality Hint: ${user.bio.substring(0, 100)}` : ''}
        ${user.location ? `Cultural Context: ${user.location}` : ''}
        Art Style: ${randomStyle}
        Setting: ${randomEnv}
        Key Visual Detail: ${randomElement}
        ${contextDetails.length > 0 ? 'Additional Context: ' + contextDetails.join(', ') : ''}
    `;

    try {
        // Attempt 1: Image-to-Image (Transformation)
        if (imageData) {
            console.log("Attempting Image-to-Image generation...");
            const prompt = `
                Transform this person into a legendary character card art.
                
                ${basePrompt}
                
                Requirements:
                - Close-up or Medium-Close-up Portrait. The face must be clearly visible and the main focus.
                - Subject should be centered.
                - Make the character look epic, powerful, and heroic.
                - High quality, highly detailed digital art.
                - The face should be stylistically adapted to the art style but still hint at the original person if possible.
                - Aspect Ratio: 1:1 Square.
                - ABSOLUTELY NO TEXT, NO LETTERS, NO NUMBERS, NO UI, NO HUD. Just the artwork.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { mimeType: imageData.mimeType, data: imageData.base64 } },
                        { text: prompt }
                    ]
                },
                config: {
                    imageConfig: { aspectRatio: "1:1" }
                }
            });

            const img = extractImageFromResponse(response);
            if (img) return img;
            console.warn("Image-to-Image returned no image data, falling back...");
        }
    } catch (e: any) {
        console.error("Image-to-Image generation failed:", e);
        // Check if this is a quota error
        const isQuotaError = e?.message?.includes('RESOURCE_EXHAUSTED') || 
                            e?.status === 429 || 
                            e?.statusCode === 429 ||
                            e?.message?.includes('429');
        if (isQuotaError) {
            console.log(`Image generation quota exhausted for model gemini-2.5-flash-image`);
        }
        // If we have imageData, try to return it as a fallback
        if (imageData) {
            console.log("Returning original image data as fallback");
            return `data:${imageData.mimeType};base64,${imageData.base64}`;
        }
    }

    console.log("Attempting Text-to-Image generation...");

    try {
        // Attempt 2: Text-to-Image (Fallback)
        const fallbackPrompt = `
            Create a masterpiece trading card illustration of a "${archetype}".
            
            ${basePrompt}
            
            Description:
            An epic, powerful character representing a master of ${primaryLang}. 
            They should look like a ${archetype}. 
            Composition: Close-up Portrait, Head and Shoulders, Face clearly focused.
            Dynamic pose, cinematic lighting, 8k resolution, trending on artstation.
            Aspect Ratio: 1:1 Square.
            IMPORTANT: Do not generate any text, labels, numbers, or card stats in the image. Pure visual illustration only.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: fallbackPrompt }] },
            config: { imageConfig: { aspectRatio: "1:1" } }
        });

        const img = extractImageFromResponse(response);
        if (img) return img;
        
        console.warn("Text-to-Image returned no image data, using fallback");
    } catch (e: any) {
        console.error("Text-to-Image generation failed:", e);
        // Check if this is a quota error
        const isQuotaError = e?.message?.includes('RESOURCE_EXHAUSTED') || 
                            e?.status === 429 || 
                            e?.statusCode === 429 ||
                            e?.message?.includes('429');
        if (isQuotaError) {
            console.log(`Image generation quota exhausted for model gemini-2.5-flash-image`);
        }
    }

    // If we reach here, AI generation failed - return undefined to signal no AI image available
    console.warn("AI image generation failed - will use GitHub avatar fallback");
    return undefined;
};
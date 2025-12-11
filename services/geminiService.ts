import { GoogleGenAI, Type } from "@google/genai";
import { GithubUser, CardData } from '../types';
import { getApiKey } from '../utils/config';

// Fallback function to generate basic card data without AI
export const generateBasicCardData = (
  user: GithubUser,
  repoSummary: { 
    topLanguages: string[], 
    totalStars: number, 
    totalForks: number,
    allTopics: string[],
    repoNames: string[],
    repoDescriptions: string[],
    originalRepoCount: number
  }
): CardData => {
  const accountAge = new Date().getFullYear() - new Date(user.created_at).getFullYear();
  const estimatedCommits = user.public_repos * 50 + accountAge * 300;
  
  // Determine archetype based on top language
  const topLang = repoSummary.topLanguages[0] || 'Code';
  const archetypes: Record<string, string> = {
    'JavaScript': 'Frontend Alchemist',
    'TypeScript': 'Type-Safe Paladin',
    'Python': 'Data Sorcerer',
    'Java': 'Enterprise Architect',
    'Go': 'Concurrency Master',
    'Rust': 'Memory Guardian',
    'C++': 'Performance Ninja',
    'C#': 'Framework Wizard',
    'Ruby': 'Rails Conductor',
    'PHP': 'Web Craftsman',
  };
  
  const archetype = archetypes[topLang] || `${topLang} Developer`;
  
  // Generate a simple description
  const descriptions = [
    'Commits code with precision and style.',
    'Turns coffee into code.',
    'Debugging is their superpower.',
    'Writes clean code while others sleep.',
    'The architect of elegant solutions.',
  ];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  // Determine which stat is the trump
  const stats = [
    { label: 'Repositórios', value: user.public_repos },
    { label: 'Estrelas', value: repoSummary.totalStars },
    { label: 'Seguidores', value: user.followers },
    { label: 'Commits', value: estimatedCommits, unit: '+' }
  ];
  
  // Find the highest stat for trump
  const maxStat = stats.reduce((max, stat) => stat.value > max.value ? stat : max, stats[0]);
  
  // Generate special abilities based on stats
  const abilities = [
    { name: 'Git Push --force', description: 'Dobra o valor de Commits se for o atributo escolhido.' },
    { name: 'Merge Master', description: 'Ganha automaticamente se o oponente tiver menos repositórios.' },
    { name: 'Code Review', description: 'Anula o trunfo do oponente se tiver mais estrelas.' },
    { name: 'Sudo Deploy', description: 'Troca o valor de Seguidores com o oponente.' },
  ];
  const specialAbility = abilities[Math.floor(Math.random() * abilities.length)];
  
  return {
    id: `DEV-${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
    archetype,
    description,
    stats,
    specialAbility,
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

const getAi = (apiKey?: string) => {
    try {
        const key = getApiKey(apiKey);
        return new GoogleGenAI({ apiKey: key });
    } catch (error) {
        throw new Error("Failed to initialize AI service. If the default API quota is exceeded, please add your own Gemini API key in settings.");
    }
};

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
    allTopics: string[],
    repoNames: string[],
    repoDescriptions: string[],
    originalRepoCount: number
  },
  apiKey?: string
): Promise<CardData> => {
  const ai = getAi(apiKey);
  
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
    Seja ESPECÍFICO e evite clichês genéricos. Use o contexto completo para criar uma carta ÚNICA.

    Perfil do Usuário:
    - Username: ${user.login}
    - Nome: ${user.name || 'Não informado'}
    - Bio: ${user.bio || 'Sem bio (desenvolve em silêncio, deixa o código falar)'}
    - Repositórios Públicos: ${user.public_repos} (${repoSummary.originalRepoCount} originais, ${user.public_repos - repoSummary.originalRepoCount} forks)
    - Seguidores: ${user.followers}
    - Seguindo: ${user.following}
    - Conta criada em: ${user.created_at} (${accountAge} anos de experiência no GitHub)
    ${contextualInsights.length > 0 ? '\nContexto Adicional:\n' + contextualInsights.map(i => `- ${i}`).join('\n') : ''}
    
    Atividade de Código:
    - Linguagens Principais: ${repoSummary.topLanguages.join(', ') || 'Polímata de múltiplas tecnologias'}
    - Total Estrelas: ${repoSummary.totalStars}
    - Total Forks: ${repoSummary.totalForks}

    ANÁLISE DE PERSONALIDADE (Use isto para criar o archetype e description):
    ${hasStrongBio ? '- Perfil bem documentado, provavelmente comunicativo e atento a detalhes' : '- Perfil minimalista, deixa o código falar por si'}
    ${isPopular ? '- Reconhecido pela comunidade, líder de opinião' : '- Foca no trabalho, não na fama'}
    ${isProlific ? '- Extremamente produtivo, provavelmente trabalha em múltiplos projetos' : '- Foca em qualidade sobre quantidade'}
    ${isActiveContributor ? '- Projetos com alto engajamento, código que inspira outros' : '- Desenvolvedor independente ou em projetos privados'}
    ${user.company ? `- Trabalha em ${user.company}, traz experiência corporativa` : '- Desenvolvedor independente ou freelancer'}
    ${user.location ? `- Baseado em ${user.location}, pode ter influências culturais locais` : ''}

    REQUISITOS OBRIGATÓRIOS DE SAÍDA (JSON):

    1. 'archetype': Crie uma classe de RPG ÚNICA e ESPECÍFICA. NÃO use termos genéricos.
       - Combine a linguagem principal com personalidade inferida e contexto geográfico/cultural
       - Exemplos: "${user.location?.includes('Brasil') ? 'Capoeirista do React' : 'Samurai do TypeScript'}", "Alquimista ${repoSummary.allTopics[0] || 'de Código'}", "${user.company ? 'Arquiteto Corporativo' : 'Hacker Nômade'} de ${repoSummary.topLanguages[0] || 'Multi-Stack'}"
       - Se o usuário tem repos sobre ML/AI/Data, use termos como "Cientista de Dados", "Bruxo de IA", etc.
       - Se é full-stack (múltiplas linguagens), destaque isso: "Polímata Full-Stack", "Mestre dos Mil Frameworks"
    
    2. 'description': Uma frase de efeito PERSONALIZADA que referencia:
       - Bio do usuário (se existir e for relevante)
       - Localização ou empresa (se disponível)
       - Tópicos ou nomes de projetos específicos
       - Personalidade inferida
       Exemplo: "${user.bio?.substring(0, 50)}..." ou "De ${user.location || 'algum lugar do mundo'}, ${isProlific ? 'cria projetos como respira' : 'aperfeiçoa cada linha de código'}."
    
    3. 'stats': Array com exatamente 4 atributos OBRIGATÓRIOS.
       - Use estes nomes exatos: 'Repositórios', 'Estrelas', 'Seguidores', 'Commits'.
       - Valores: 
         * Use os números reais para Repositórios, Estrelas, Seguidores.
         * Para 'Commits', estime: (public_repos * 60 + anos * 400 + totalStars * 2 + originalRepoCount * 30).
    
    4. 'superTrunfoAttribute': Escolha o atributo numérico mais impressionante para ser o trunfo.
    
    5. 'specialAbility': Um objeto com 'name' e 'description'.
       - O NOME deve ser ESPECÍFICO ao perfil: 
         * Se usa Python/Data: "DataFrame Overflow", "Neural Net Deploy"
         * Se usa React/Frontend: "Virtual DOM Mastery", "Component Tree Fury"
         * Se tem muitas estrelas: "Open Source Legend", "Community Magnet"
         * Se de empresa grande: "Enterprise Architect", "Scrum Sprint Lord"
         * Se localização específica: incorpore referências culturais sutis
       - A descrição deve ser criativa e relevante ao jogo.
    
    6. 'id': Gere um código como "DEV-XX" onde XX é um número entre 01-99.

    IMPORTANTE: Faça a carta DIFERENTE de outras. Use TODOS os detalhes disponíveis. Seja OUSADO nas suposições sobre personalidade.
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
    throw new Error("Failed to generate card data");
  }

  return JSON.parse(response.text) as CardData;
};

export const generateCharacterImage = async (
    imageData: { base64: string; mimeType: string } | null, 
    archetype: string, 
    primaryLang: string,
    user: GithubUser,
    topics: string[],
    apiKey?: string,
    avatarUrl?: string
): Promise<string> => {
    const ai = getAi(apiKey);
    
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
            console.log(`Image generation quota exhausted for model gemini-2.5-flash-image; using avatarUrl fallback`);
            if (avatarUrl) {
                return avatarUrl;
            }
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
            console.log(`Image generation quota exhausted for model gemini-2.5-flash-image; using avatarUrl fallback`);
        }
    }

    // Final fallback: use avatarUrl if provided, otherwise throw
    if (avatarUrl) {
        console.log("Using GitHub avatar URL as final fallback");
        return avatarUrl;
    }
    
    throw new Error("No image generated from either method and no fallback avatar available");
};
import { GoogleGenAI, Type } from "@google/genai";
import { GithubUser, CardData } from '../types';

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
    const key = apiKey || process.env.API_KEY;
    if (!key) throw new Error("API Key not found. Please add your Google API Key in settings.");
    return new GoogleGenAI({ apiKey: key });
};

const extractImageFromResponse = (response: any): string | null => {
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
  repoSummary: { topLanguages: string[], totalStars: number, totalForks: number },
  apiKey?: string
): Promise<CardData> => {
  const ai = getAi(apiKey);
  
  const prompt = `
    Aja como um gerador de cartas para o jogo "Super Trunfo" edição Desenvolvedores.
    Analise o perfil GitHub abaixo e gere os dados da carta.

    Perfil do Usuário:
    - Username: ${user.login}
    - Bio: ${user.bio || 'Sem bio'}
    - Public Repos: ${user.public_repos}
    - Followers: ${user.followers}
    - Created At: ${user.created_at}
    
    Atividade de Código (Amostra):
    - Top Linguagens: ${repoSummary.topLanguages.join(', ')}
    - Total Estrelas: ${repoSummary.totalStars}
    - Total Forks: ${repoSummary.totalForks}

    REQUISITOS OBRIGATÓRIOS DE SAÍDA (JSON):

    1. 'archetype': Uma classe de RPG criativa baseada nas linguagens (ex: "Pyromancer de Dados" para Python, "Paladino do Typescript", "Ladino do Backend").
    2. 'description': Uma frase de efeito curta e engraçada sobre o perfil.
    3. 'stats': Array com exatamente 4 atributos OBRIGATÓRIOS.
       - Use estes nomes exatos: 'Repositórios', 'Estrelas', 'Seguidores', 'Commits'.
       - Valores: 
         * Use os números reais para Repositórios, Estrelas, Seguidores.
         * Para 'Commits', estime um número baseado na atividade (ex: public_repos * 50 + anos de conta * 300).
         * Importante: Ajuste os valores para que o jogo seja jogável (nem todos devem ser baixos ou máximos).
    4. 'superTrunfoAttribute': Escolha o atributo numérico mais impressionante para ser o trunfo.
    5. 'specialAbility': Um objeto com 'name' e 'description'.
       - O nome deve ser um comando Git ou termo de dev (ex: "Git Reset", "Force Push", "Merge Conflict", "Sudo Make Me a Sandwich").
       - A descrição deve explicar o efeito no jogo de cartas (ex: "Troca o valor de Estrelas com o oponente", "Anula o trunfo do oponente", "Vence automaticamente se o atributo for Commits").
    6. 'id': Gere um código como "DEV-XX" onde XX é um número aleatório.

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
    apiKey?: string
): Promise<string> => {
    const ai = getAi(apiKey);
    
    // Select random elements from static arrays
    const randomStyle = ART_STYLES[Math.floor(Math.random() * ART_STYLES.length)];
    const randomEnv = ENVIRONMENTS[Math.floor(Math.random() * ENVIRONMENTS.length)];
    const randomElement = POWER_ELEMENTS[Math.floor(Math.random() * POWER_ELEMENTS.length)];

    // Construct a rich, dynamic prompt
    const basePrompt = `
        Character Class: ${archetype}
        Primary Coding Language/Theme: ${primaryLang}
        Art Style: ${randomStyle}
        Setting: ${randomEnv}
        Key Visual Detail: ${randomElement}
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
    } catch (e) {
        console.warn("Image-to-Image generation failed, falling back to Text-to-Image.", e);
    }

    console.log("Attempting Text-to-Image generation...");

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
    
    throw new Error("No image generated from either method");
};
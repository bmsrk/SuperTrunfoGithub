# AI Personalization in DevTrunfo

## Overview

DevTrunfo uses advanced prompt engineering with Google Gemini AI to create truly unique and personalized trading cards for each GitHub developer. This document explains how the personalization system works and what makes each card special.

## Personalization Pipeline

### 1. Data Collection

The system gathers comprehensive data from multiple sources:

#### GitHub User Profile
- Username, name, bio
- Location, company affiliation
- Social media links (Twitter, blog)
- Account age and creation date
- Public repository count
- Followers and following counts
- Hiring availability status

#### GitHub Repository Analysis
- Top programming languages (up to 3)
- Total stars across all repositories
- Total forks
- Repository topics/tags
- Repository names and descriptions
- Original vs forked repository ratio

### 2. Contextual Insights Generation

The system analyzes the collected data to infer personality traits and preferences:

#### Personality Inference
```typescript
- hasStrongBio: bio.length > 20
  → "Perfil bem documentado, provavelmente comunicativo e atento a detalhes"
  
- isPopular: followers > 50
  → "Reconhecido pela comunidade, líder de opinião"
  
- isProlific: public_repos > 20
  → "Extremamente produtivo, provavelmente trabalha em múltiplos projetos"
  
- isActiveContributor: totalStars > 100 || totalForks > 20
  → "Projetos com alto engajamento, código que inspira outros"
```

#### Cultural Context
Location information influences card generation:
- **Brazil/Brasil**: May result in archetypes like "Capoeirista do React"
- **Japan/Tokyo**: Adds Japanese aesthetic elements
- **India**: Incorporates colorful Indian-inspired patterns
- **Europe**: Includes European architectural elements

### 3. Archetype Generation

Archetypes are created by combining multiple factors:

#### Language-Based Foundation
```typescript
const archetypes = {
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
}
```

#### Context Enhancement
The base archetype is enhanced with:
- Geographic/cultural references
- Company context (corporate vs indie)
- Tech specialization (ML/AI, frontend, full-stack)
- Activity patterns

#### Examples of Personalized Archetypes
- Brazilian React dev: **"Capoeirista do React"**
- ML engineer: **"Bruxo de IA"** (AI Wizard)
- Multi-language dev: **"Polímata Full-Stack"**
- Corporate Java dev: **"Arquiteto Corporativo de Java"**
- Indie Rust dev: **"Hacker Nômade de Rust"**

### 4. Description Personalization

Descriptions reference actual profile data:

#### Bio Integration
If the user has a bio, it's incorporated:
```
"${user.bio.substring(0, 50)}..."
```

#### Location and Activity
```
"De ${location}, ${isProlific ? 'cria projetos como respira' : 'aperfeiçoa cada linha de código'}"
```

#### Examples
- "De São Paulo, cria projetos como respira"
- "Open source advocate from Berlin, perfecting TypeScript one commit at a time"
- "Data wizard specializing in Python and ML frameworks"

### 5. Special Abilities

Abilities are matched to technical expertise:

#### Tech Stack Based
- **Python/Data**: "DataFrame Overflow", "Neural Net Deploy"
- **React/Frontend**: "Virtual DOM Mastery", "Component Tree Fury"
- **Backend/Systems**: "Thread Pool Optimization", "Cache Invalidation Master"

#### Activity Based
- **High stars**: "Open Source Legend", "Community Magnet"
- **Corporate**: "Enterprise Architect", "Scrum Sprint Lord"
- **Indie hacker**: "Solo Deploy Master", "Midnight Code Warrior"

### 6. Character Art Generation

Visual elements adapt to context through multiple prompt layers:

#### Art Styles (10+ variants)
- Cyberpunk 2077 aesthetic
- Ethereal High Fantasy
- Solarpunk
- Dark Synthwave
- Steampunk
- Sci-fi Minimalism
- Gothic Horror Tech
- Retro 80s Anime

#### Environmental Context
- Cultural motifs based on location
- Tech-specific visual elements (serpentine for Python, gears for Rust)
- Topic-based additions (neural networks for AI, blockchain patterns for crypto)

#### Dynamic Composition
```typescript
// Location influences
if (location.includes('Brasil')) {
  contextDetails.push('with vibrant Brazilian color influences');
}

// Tech stack influences
if (primaryLang === 'Python') {
  contextDetails.push('with serpentine or data visualization motifs');
}

// Topic influences
if (topics.includes('machine-learning')) {
  contextDetails.push('surrounded by neural network visualizations');
}
```

## Statistics Calculation

### Intelligent Commit Estimation

The system uses a sophisticated formula to estimate total commits:

```typescript
// For AI-generated cards
commits = (public_repos * 60) + (accountAge * 400) + (totalStars * 2) + (originalRepoCount * 30)

// Assumptions:
// - ~60 commits per repository on average
// - ~400 commits per year of account activity
// - Bonus for community engagement (stars)
// - Bonus for original content vs forks
```

### Trump Attribute Selection

The system automatically identifies the most impressive statistic:
```typescript
const stats = [
  { label: 'Repositórios', value: user.public_repos },
  { label: 'Estrelas', value: totalStars },
  { label: 'Seguidores', value: user.followers },
  { label: 'Commits', value: estimatedCommits }
];

superTrunfoAttribute = stats.reduce((max, stat) => 
  stat.value > max.value ? stat : max
).label;
```

## Prompt Engineering Techniques

### 1. Contextual Priming
The prompt starts by establishing the creative context:
```
"Aja como um gerador CRIATIVO de cartas para o jogo 'Super Trunfo' edição Desenvolvedores.
Analise profundamente o perfil GitHub abaixo e FAÇA SUPOSIÇÕES OUSADAS sobre a personalidade..."
```

### 2. Explicit Instructions
Clear, specific requirements prevent generic output:
```
"NÃO use termos genéricos"
"Seja ESPECÍFICO e evite clichês"
"Use o contexto completo para criar uma carta ÚNICA"
```

### 3. Rich Context Injection
All available data is structured and provided:
- User profile data with interpretation
- Repository analysis with insights
- Personality inference with reasoning
- Cultural and professional context

### 4. Example-Driven Generation
The prompt includes specific examples for each field:
```
Exemplos: 
- "${user.location?.includes('Brasil') ? 'Capoeirista do React' : 'Samurai do TypeScript'}"
- "Alquimista ${repoSummary.allTopics[0] || 'de Código'}"
```

### 5. Structured Output
JSON schema enforcement ensures consistency:
```typescript
responseSchema: {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    archetype: { type: Type.STRING },
    description: { type: Type.STRING },
    specialAbility: { ... },
    stats: { ... },
    superTrunfoAttribute: { type: Type.STRING }
  }
}
```

## Quality Assurance

### Fallback System
If AI generation fails, the system uses `generateBasicCardData()`:
- Still personalizes based on language
- Maintains consistent structure
- Ensures cards are always generated

### Testing
The personalization logic is validated through:
- 20+ unit tests for basic generation
- Edge case coverage (minimal profiles, old accounts, various languages)
- Consistency validation
- Formula verification

## Results

This multi-layered approach creates cards that are:
- ✅ **Unique**: Each profile generates a different card
- ✅ **Relevant**: References actual profile data
- ✅ **Culturally aware**: Incorporates location context
- ✅ **Technically accurate**: Matches tech stack and expertise
- ✅ **Engaging**: Creative and fun while being informative
- ✅ **Consistent**: Structured output for game mechanics

## Examples of Personalization in Action

### Example 1: Brazilian Full-Stack Developer
**Input Profile:**
- Location: São Paulo, Brazil
- Languages: JavaScript, TypeScript, Python
- Bio: "Building the future of web"
- 150 repos, 2000 stars, 500 followers

**Generated Card:**
- Archetype: "Capoeirista Full-Stack de São Paulo"
- Description: "Da terra do café, transforma ideias em código com a agilidade de um capoeirista"
- Special Ability: "Jeitinho Brasileiro" - "Encontra soluções criativas para qualquer problema técnico"
- Art: Vibrant Brazilian colors with tech motifs

### Example 2: AI Research Engineer
**Input Profile:**
- Location: San Francisco
- Languages: Python, Julia
- Topics: machine-learning, deep-learning, pytorch
- 50 repos, 5000 stars, 1000 followers

**Generated Card:**
- Archetype: "Arquiteto de Redes Neurais"
- Description: "Treina modelos como quem esculpe o futuro"
- Special Ability: "Neural Net Deploy" - "Implanta modelos com precisão cirúrgica"
- Art: Neural network visualizations with cyberpunk aesthetic

### Example 3: Systems Programmer
**Input Profile:**
- Location: Tokyo, Japan
- Languages: Rust, C++, Go
- 30 repos, 800 stars, 200 followers

**Generated Card:**
- Archetype: "Samurai da Memória Segura"
- Description: "Código sem vazamentos, como a disciplina de um samurai"
- Special Ability: "Zero-Cost Abstraction" - "Performance perfeita sem sacrifícios"
- Art: Japanese aesthetic with metallic, gear-based elements

## Conclusion

The AI personalization system in DevTrunfo represents a significant advancement in automated content generation, combining structured data analysis, cultural awareness, technical expertise matching, and creative prompt engineering to produce unique, engaging, and relevant content for each user.

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DevTrunfo - GitHub Battle Cards

Generate custom Super Trunfo trading cards based on GitHub profiles using Gemini AI analysis.

## 🚀 Live Demo

Visit the live app: [https://bmsrk.github.io/SuperTrunfoGithub/](https://bmsrk.github.io/SuperTrunfoGithub/)

## ✨ Features

- 🎨 **AI-Powered Character Art**: Generate unique character illustrations based on GitHub profiles using Gemini 2.5 Flash Image
- 🧠 **Intelligent Personalization**: Advanced AI prompts analyze profile data to create truly unique cards:
  - Personality inference from bio, activity patterns, and coding style
  - Cultural context from location (e.g., "Capoeirista do React" for Brazilian developers)
  - Tech-specific archetypes based on primary languages and topics
  - Company context for corporate vs indie developers
  - Specialized abilities matching developer expertise (e.g., "Neural Net Deploy" for ML engineers)
- 📊 **Smart Stats Calculation**: 
  - Automatic calculation from GitHub activity
  - Intelligent commit estimation based on account age, repositories, and engagement
  - Dynamic trump attribute selection based on strongest stat
- 🎮 **Super Trunfo Game Mechanics**: Complete with special abilities and trump attributes
- 💾 **High-Quality Downloads**: Export cards as 3x resolution PNG images
- 🔐 **Flexible API Configuration**: 
  - Optional GitHub token for higher API rate limits (5000/hour vs 60/hour)
  - Default Gemini API key included (IP-restricted for GitHub Pages)
  - Bring your own Gemini API key for unlimited generation
- 🎯 **Fallback System**: Graceful degradation if AI services are unavailable

## 🛠️ Run Locally

**Prerequisites:** Node.js 18+

1. Clone the repository:
   ```bash
   git clone https://github.com/bmsrk/SuperTrunfoGithub.git
   cd SuperTrunfoGithub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env.local` file and add your Gemini API key:
   ```
   API_KEY=your_gemini_api_key_here
   ```
   Note: The app can work without this, but you may hit rate limits.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🧪 Testing

This project includes end-to-end tests using Playwright.

### Run E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install --with-deps chromium

# Run tests
npm run test:e2e

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# View test report
npm run test:e2e:report
```

The test suite covers:
- ✅ Home page loading and UI elements
- ✅ Form validation and input handling
- ✅ Mock profile generation
- ✅ Card display and interaction
- ✅ Settings panel and API key management
- ✅ Responsive design across devices
- ✅ API key optional functionality
- ✅ Service layer functions
- ✅ Prompt personalization logic

## 🚢 Deployment

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

### Manual Deployment

You can also deploy manually using:

```bash
npm run deploy
```

This will build the project and push it to the `gh-pages` branch.

## 🧠 How AI Personalization Works

DevTrunfo uses advanced prompt engineering to create truly unique cards for each developer:

### Profile Analysis
The AI analyzes multiple aspects of your GitHub profile:
- **Coding Style**: Primary languages, repository topics, and project types
- **Personality Traits**: Inferred from bio, activity patterns, and engagement metrics
- **Cultural Context**: Location influences archetype names and descriptions
- **Professional Context**: Company affiliation, open-source activity, hiring status
- **Technical Focus**: Special abilities based on tech stack (e.g., ML, frontend, systems)

### Contextual Card Generation

**Archetype Creation**: Instead of generic titles, archetypes are personalized:
- A Brazilian React developer might become a "Capoeirista do React"
- A data scientist with Python expertise becomes a "Bruxo de IA" (AI Wizard)
- A prolific full-stack developer becomes "Polímata Full-Stack"

**Description Personalization**: References actual bio content, location, or inferred traits:
- "De São Paulo, cria projetos como respira" (From São Paulo, creates projects like breathing)
- Incorporates actual bio snippets when available
- Adapts tone based on profile completeness and activity level

**Special Abilities**: Matched to technical expertise:
- Python/Data developers: "DataFrame Overflow", "Neural Net Deploy"
- React/Frontend developers: "Virtual DOM Mastery", "Component Tree Fury"
- Popular projects: "Open Source Legend", "Community Magnet"
- Enterprise developers: "Enterprise Architect", "Scrum Sprint Lord"

**Character Art**: Visual elements adapt to context:
- Cultural motifs based on location
- Tech stack visual hints (serpentine for Python, gears for Rust)
- Art style variety with 10+ different aesthetics
- Dynamic composition based on personality inference

### Smart Statistics
- **Commit Estimation**: Formula considers repos, account age, stars, and original content
- **Trump Selection**: Automatically picks the most impressive stat
- **Balanced Stats**: Ensures fair gameplay while reflecting actual achievements

## 🔧 Configuration

- **GitHub Pages Base Path**: Set in `vite.config.ts` - currently configured for `/SuperTrunfoGithub/`
- **API Keys**: 
  - A default Gemini API key is included (IP-restricted to GitHub Pages)
  - Users can provide their own keys through the UI settings for unlimited usage
  - GitHub tokens are optional but recommended to avoid rate limits (60/hour → 5000/hour)

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 💙 Credits

Made with love by [@enrichthesoil](https://x.com/enrichthesoil)

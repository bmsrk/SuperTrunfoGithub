<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DevTrunfo - GitHub Battle Cards

Generate custom Super Trunfo trading cards based on GitHub profiles using Gemini AI analysis.

## 🚀 Live Demo

Visit the live app: [https://bmsrk.github.io/SuperTrunfoGithub/](https://bmsrk.github.io/SuperTrunfoGithub/)

## ✨ Features

- 🎲 **Deterministic Local Generator**: Creates unique cards based on your GitHub profile using a local algorithm - no external API required!
- 🧠 **Intelligent Personalization**: Advanced logic analyzes profile data to create truly unique cards:
  - Personality inference from bio, activity patterns, and coding style
  - Cultural context from location (e.g., "Capoeirista do React" for Brazilian developers)
  - Tech-specific archetypes based on primary languages and topics
  - Company context for corporate vs indie developers
  - Specialized abilities matching developer expertise (e.g., "Neural Net Deploy" for ML engineers)
- 📊 **Smart Stats Calculation**: 
  - Automatic calculation from GitHub activity
  - Intelligent commit estimation based on account age, repositories, and engagement
  - Dynamic trump attribute selection based on strongest stat
  - Deterministic results - same profile always generates the same card
- 🎮 **Super Trunfo Game Mechanics**: Complete with special abilities and trump attributes
- 💾 **High-Quality Downloads**: Export cards as 3x resolution PNG images
- 🔐 **Privacy First**: 
  - No external API keys required or embedded
  - Optional GitHub token for higher API rate limits (5000/hour vs 60/hour)
  - All data processing happens locally in your browser

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

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

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

## 🧠 How the Local Generator Works

DevTrunfo uses a deterministic algorithm to create unique and consistent cards for each developer:

### Profile Analysis
The generator analyzes multiple aspects of your GitHub profile:
- **Coding Style**: Primary languages, repository topics, and project types
- **Personality Traits**: Inferred from bio, activity patterns, and engagement metrics
- **Cultural Context**: Location influences archetype names and descriptions
- **Professional Context**: Company affiliation, open-source activity, hiring status
- **Technical Focus**: Special abilities based on tech stack (e.g., ML, frontend, systems)

### Deterministic Generation

**Fingerprinting**: A unique fingerprint is created from your profile data:
- Username + repository metrics + top languages + topics
- This fingerprint is hashed using djb2 to create a seed
- The seed feeds a Mulberry32 PRNG for deterministic randomness
- Same profile always generates the same card!

**Archetype Creation**: Instead of generic titles, archetypes are personalized:
- A Brazilian React developer might become a "Frontend Alchemist"
- A data scientist with Python expertise becomes a "Data Sorcerer"
- A prolific full-stack developer becomes "Script Wizard"
- Weighted random selection based on languages, topics, and activity

**Description Personalization**: References actual bio content, location, or inferred traits:
- Incorporates actual bio snippets when available
- Mentions location, follower count, star count
- References repository topics and specializations
- Adapts based on profile completeness and activity level

**Special Abilities**: Matched to technical expertise:
- Python/Data developers: "Neural Net Deploy", "DataFrame Overflow"
- React/Frontend developers: "Virtual DOM Storm"
- Popular projects: "Open Source Legend", "Community Magnet"
- Enterprise developers: "Enterprise Power"

### Smart Statistics
- **Commit Estimation**: Formula considers repos, account age, stars, and original content
- **Normalization**: Stats normalized to 1-100 range using logarithmic scaling
- **Trump Selection**: Automatically picks the highest normalized stat (with small random chance)
- **Deterministic**: Same inputs always produce the same outputs

## 🔧 Configuration

- **GitHub Pages Base Path**: Set in `vite.config.ts` - currently configured for `/SuperTrunfoGithub/`
- **GitHub Token (Optional)**: 
  - Can be provided through the UI settings
  - Increases GitHub API rate limits from 60/hour to 5000/hour
  - Stored locally in browser localStorage
- **No External API Keys**: 
  - The app uses a local deterministic generator by default
  - No external AI services are required or called
  - All card generation happens in your browser

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 💙 Credits

Made with love by [@enrichthesoil](https://x.com/enrichthesoil)

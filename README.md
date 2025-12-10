<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DevTrunfo - GitHub Battle Cards

Generate custom Super Trunfo trading cards based on GitHub profiles using Gemini AI analysis.

## 🚀 Live Demo

Visit the live app: [https://bmsrk.github.io/SuperTrunfoGithub/](https://bmsrk.github.io/SuperTrunfoGithub/)

## ✨ Features

- 🎨 Generate unique AI-powered character art based on GitHub profiles
- 📊 Automatic stats calculation from GitHub activity
- 🎮 Super Trunfo card game mechanics
- 💾 Download cards as high-quality images
- 🔐 Optional GitHub token for higher API rate limits
- 🤖 Powered by Google Gemini AI

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

## 🚢 Deployment

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

### Manual Deployment

You can also deploy manually using:

```bash
npm run deploy
```

This will build the project and push it to the `gh-pages` branch.

## 🔧 Configuration

- **GitHub Pages Base Path**: Set in `vite.config.ts` - currently configured for `/SuperTrunfoGithub/`
- **API Keys**: Can be provided via environment variables or through the UI settings

## 📝 License

MIT License - feel free to use this project for your own purposes!

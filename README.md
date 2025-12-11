<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DevTrunfo - GitHub Battle Cards

Generate custom Super Trunfo trading cards based on GitHub profiles using Gemini AI analysis.

## 📸 Screenshots

<div align="center">

### Home Page with AI Features Info
<img width="600" alt="Homepage" src="https://github.com/user-attachments/assets/926fa662-efa5-4183-adea-ca90702f92cc" />

### Generated Card Example
<img width="600" alt="Card Display" src="https://github.com/user-attachments/assets/87a0ad5d-032d-4b91-8608-f33192b897a0" />

</div>

## 🚀 Live Demo

Visit the live app: [https://bmsrk.github.io/SuperTrunfoGithub/](https://bmsrk.github.io/SuperTrunfoGithub/)

## ✨ Features

- 🎨 Generate unique AI-powered character art based on GitHub profiles
- 📊 Automatic stats calculation from GitHub activity
- 🎮 Super Trunfo card game mechanics
- 💾 Download cards as high-quality images
- 🔐 Optional GitHub token for higher API rate limits
- 🤖 Powered by Google Gemini AI
- ⚡ Default API key included (IP-restricted for GitHub Pages)
- 🎭 Bring your own API key for unlimited generation

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
- ✅ Home page loading
- ✅ Form validation
- ✅ Mock profile generation
- ✅ Card display and interaction
- ✅ Settings panel functionality
- ✅ Responsive design

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
- **API Keys**: 
  - A default Gemini API key is included (IP-restricted to GitHub Pages)
  - Users can provide their own keys through the UI settings for unlimited usage
  - GitHub tokens are optional but recommended to avoid rate limits

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 💙 Credits

Made with love by [@enrichthesoil](https://x.com/enrichthesoil)

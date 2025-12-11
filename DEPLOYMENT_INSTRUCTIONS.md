# Deployment Instructions for GitHub Pages

## Quick Start

After merging this PR, follow these steps to deploy your app to GitHub Pages:

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/bmsrk/SuperTrunfoGithub
2. Click on **Settings** (top navigation)
3. Click on **Pages** (left sidebar under "Code and automation")
4. Under "Build and deployment":
   - **Source:** Select "GitHub Actions"
   - That's it! No other configuration needed.

### Step 2: Trigger Deployment

The GitHub Actions workflow will automatically deploy when you:
- Push to the `main` branch
- Manually trigger the workflow from the Actions tab

To manually trigger:
1. Go to the **Actions** tab
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select the `main` branch
5. Click "Run workflow"

### Step 3: Access Your Site

Your site will be available at:
**https://bmsrk.github.io/SuperTrunfoGithub/**

The first deployment may take 2-5 minutes.

---

## Optional: Add Gemini API Key for Server-Side Builds

If you want the API key available during build time (not required), you can add it as a GitHub secret:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `API_KEY`
4. Value: Your Gemini API key
5. Click **Add secret**

Then update the workflow file to pass the secret:

```yaml
- name: Build
  run: npm run build
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

**Note:** This is optional. Users can also provide their own API key through the UI.

---

## Troubleshooting

### Site Not Loading (404 Error)
- Wait 2-5 minutes after first deployment
- Check that GitHub Pages is enabled with "GitHub Actions" as source
- Verify the workflow ran successfully in the Actions tab

### Assets Not Loading
- Check that the base path in `vite.config.ts` matches your repository name
- Current setting: `/SuperTrunfoGithub/`
- If you rename the repo, update this value

### Workflow Failing
- Check the workflow logs in the Actions tab
- Ensure all dependencies install correctly
- Verify TypeScript compilation passes locally: `npm run build`

---

## Manual Deployment (Alternative)

If you prefer to deploy manually using `gh-pages` package:

```bash
npm run deploy
```

This will:
1. Build the project
2. Push the built files to the `gh-pages` branch
3. GitHub Pages will serve from that branch

**Note:** If using manual deployment, set GitHub Pages source to "Deploy from a branch" and select `gh-pages` branch.

---

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain name
2. Configure DNS records at your domain provider:
   - Add CNAME record pointing to `bmsrk.github.io`
3. Update GitHub Pages settings with your custom domain
4. Enable "Enforce HTTPS"

Example `public/CNAME`:
```
devtrunfo.example.com
```

---

## Monitoring

### Check Deployment Status
- Go to **Actions** tab to see workflow runs
- Green checkmark = successful deployment
- Red X = failed deployment (click for details)

### View Site
- **Production:** https://bmsrk.github.io/SuperTrunfoGithub/
- **Workflow:** https://github.com/bmsrk/SuperTrunfoGithub/actions

---

## Support

If you encounter any issues:

1. Check the [workflow logs](https://github.com/bmsrk/SuperTrunfoGithub/actions)
2. Review the `REVIEW_SUMMARY.md` for common issues
3. Verify your build works locally: `npm run build && npm run preview`
4. Check [GitHub Pages documentation](https://docs.github.com/en/pages)

---

**Happy Deploying! 🚀**

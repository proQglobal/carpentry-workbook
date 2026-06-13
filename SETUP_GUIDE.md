# System Setup Guide

This guide details the manual setup steps required to activate the full JAMstack ecosystem.

## 1. Setup GitHub Repository
1. Push the generated codebase to your GitHub repository.
2. Ensure you have GitHub Actions enabled. Note: The action `.github/workflows/release-builder.yml` is configured to run **manually** only.
3. Turn on GitHub Pages for the repository (Settings -> Pages). Choose to deploy from a branch and select the `main` branch. This is required so your editors can access Sveltia CMS at `https://<your-username>.github.io/<your-repo>/cms/`.

## 2. Setup GitHub OAuth Application
Sveltia CMS needs permission to commit to your repository on behalf of the users.
1. Go to your GitHub Account Settings -> Developer Settings -> OAuth Apps.
2. Click **New OAuth App**.
3. **Application name**: e.g., "Sveltia CMS Auth"
4. **Homepage URL**: `https://<your-username>.github.io`
5. **Authorization callback URL**: `https://<your-cloudflare-worker-url>.workers.dev/callback` (You will update this after creating the Cloudflare worker).
6. Click Register application.
7. Generate a new Client Secret. Keep the `Client ID` and `Client Secret` handy for the next step.

## 3. Deploy Cloudflare Worker Proxy
Since Sveltia CMS runs in the browser, we use a free Cloudflare Worker to handle the OAuth handshake securely.

1. Create a free account at [Cloudflare](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. We recommend using the official open-source proxy: [sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth).
3. The easiest way to deploy is to clone that repository locally and use `wrangler`:
   ```bash
   npm install -g wrangler
   git clone https://github.com/sveltia/sveltia-cms-auth.git
   cd sveltia-cms-auth
   npm install
   ```
4. Run `npx wrangler deploy` to push it to Cloudflare. Note the output URL (e.g., `https://sveltia-cms-auth.your-subdomain.workers.dev`).
5. Configure the worker secrets securely using `wrangler`. Run these commands and paste the respective values when prompted:
   ```bash
   npx wrangler secret put GITHUB_CLIENT_ID
   npx wrangler secret put GITHUB_CLIENT_SECRET
   npx wrangler secret put ALLOWED_DOMAINS
   ```
   *(Note: Set `ALLOWED_DOMAINS` to the domain where your CMS will be hosted, e.g., `your-username.github.io`, to prevent unauthorized usage of your proxy).*

## 4. Finalize Configuration
1. Go back to your GitHub OAuth App settings and update the **Authorization callback URL** to match your new Cloudflare Worker URL + `/callback` (e.g. `https://sveltia-cms-auth.your-subdomain.workers.dev/callback`).
2. Open `static/cms/config.yml` in this repository and update the following fields:
   - `repo`: Set to `your-username/your-repo`
   - `base_url`: Set to your Cloudflare Worker URL `https://sveltia-cms-auth.your-subdomain.workers.dev`
3. Commit and push these changes to GitHub.

## 5. Editing Content & Triggering Releases
1. Content editors navigate to `https://<your-username>.github.io/<your-repo>/cms/`.
2. They log in with GitHub.
3. Thanks to the `editorial_workflow`, when they save a draft, it creates a new branch and Pull Request automatically. When they "Publish", it merges the PR into `main`.
4. As an admin, when you are ready to ship a new version to the offline edge server, go to the **Actions** tab on GitHub, select "Generate Static Site Release", and run it.
5. Download the `site-build.tar.gz` from the Releases page, put it on a USB, and run `./update-edge.sh` on your Raspberry Pi.

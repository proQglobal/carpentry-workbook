# System Setup Guide

This guide details the manual setup steps required to activate the full JAMstack ecosystem.

## 1. Setup GitHub Repository
1. Push the generated codebase to your GitHub repository.
2. Ensure you have GitHub Actions enabled. Note: The action `.github/workflows/release-builder.yml` is configured to run **manually** only.
3. Turn on GitHub Pages for the repository (Settings -> Pages). Choose to deploy from a branch and select the `main` branch. This is required so your editors can access Decap CMS at `https://<your-username>.github.io/<your-repo>/cms/`.

## 2. Setup GitHub OAuth Application
Decap CMS needs permission to commit to your repository on behalf of the users.
1. Go to your GitHub Account Settings -> Developer Settings -> OAuth Apps.
2. Click **New OAuth App**.
3. **Application name**: e.g., "Decap CMS Auth"
4. **Homepage URL**: `https://<your-username>.github.io`
5. **Authorization callback URL**: `https://<your-cloudflare-worker-url>.workers.dev/auth` (You will update this after creating the Cloudflare worker).
6. Click Register application.
7. Generate a new Client Secret. Keep the `Client ID` and `Client Secret` handy for the next step.

## 3. Deploy Cloudflare Worker Proxy
Since Decap CMS runs in the browser, we use a free Cloudflare Worker to handle the OAuth handshake securely.

1. Create a free account at [Cloudflare](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. We recommend using the open-source proxy: [sveltia/decap-cms-oauth](https://github.com/sveltia/decap-cms-oauth).
3. The easiest way to deploy is to clone that repository locally and use `wrangler`:
   ```bash
   npm install -g wrangler
   git clone https://github.com/sveltia/decap-cms-oauth.git
   cd decap-cms-oauth
   ```
4. Configure the worker variables in `wrangler.toml` or via the Cloudflare dashboard:
   - `OAUTH_CLIENT_ID`: Your GitHub OAuth App Client ID
   - `OAUTH_CLIENT_SECRET`: Your GitHub OAuth App Client Secret
5. Run `npx wrangler deploy` to push it to Cloudflare.
6. Note the output URL (e.g., `https://decap-cms-oauth.your-subdomain.workers.dev`).

## 4. Finalize Configuration
1. Go back to your GitHub OAuth App settings and update the **Authorization callback URL** to match your new Cloudflare Worker URL + `/auth` (e.g. `https://decap-cms-oauth.your-subdomain.workers.dev/auth`).
2. Open `static/cms/config.yml` in this repository and update the following fields:
   - `repo`: Set to `your-username/your-repo`
   - `base_url`: Set to your Cloudflare Worker URL `https://decap-cms-oauth.your-subdomain.workers.dev`
3. Commit and push these changes to GitHub.

## 5. Editing Content & Triggering Releases
1. Content editors navigate to `https://<your-username>.github.io/<your-repo>/cms/`.
2. They log in with GitHub.
3. Thanks to the `editorial_workflow`, when they save a draft, it creates a new branch and Pull Request automatically. When they "Publish", it merges the PR into `main`.
4. As an admin, when you are ready to ship a new version to the offline edge server, go to the **Actions** tab on GitHub, select "Generate Static Site Release", and run it.
5. Download the `site-build.tar.gz` from the Releases page, put it on a USB, and run `./update-edge.sh` on your Raspberry Pi.

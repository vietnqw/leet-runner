## leet-runner

### Deploy to `vietngoquang.com/leet-runner`

Your custom domain `vietngoquang.com` is attached to your user Pages site repo `vietnqw/vietnqw.github.io`, so this app is deployed as a **subfolder** of that site:

- Build this repo with Vite
- Copy `dist/` into `vietnqw.github.io` at `main/public/leet-runner/`

This repo automates that copy via GitHub Actions: `.github/workflows/deploy-to-vietnqw-github-io.yml`.

#### One-time setup

- **Repo**: push this code to `vietnqw/leet-runner` on branch `main`
- **Secret in `vietnqw/leet-runner`**:
  - **Name**: `GH_PAGES_TOKEN`
  - **Value**: GitHub PAT (classic) that can push to `vietnqw/vietnqw.github.io` (simplest scope: `repo`)

#### Deploy

- Run the workflow **“Deploy to vietngoquang.com/leet-runner”** (or push to `main`)
- Then the `vietnqw/vietnqw.github.io` repo will deploy the site (it builds and publishes its `out/` output)
- URL: `https://vietngoquang.com/leet-runner/`

#### Local dev

```bash
npm install
npm run dev
```


## Deploy to `vietngoquang.com/leet-runner` (GitHub Pages)

Because `vietngoquang.com` is already a **custom domain** for your user Pages site (`vietnqw/vietnqw.github.io`), the simplest way to host this app at **`vietngoquang.com/leet-runner`** is:

- Build this repo (`vietnqw/leet-runner`) with Vite
- Copy the build output into the `leet-runner/` folder inside `vietnqw/vietnqw.github.io`

This repo includes a GitHub Actions workflow that does this automatically: `.github/workflows/deploy-to-vietnqw-github-io.yml`.

### One-time setup

- **Create the repo**: `vietnqw/leet-runner` and push this code to its `main` branch.
- **In repo `vietnqw/leet-runner`**, add a secret:
  - **Name**: `GH_PAGES_TOKEN`
  - **Value**: a GitHub Personal Access Token (classic) that has permission to push to `vietnqw/vietnqw.github.io` (scope `repo` is the simplest)
- **In repo `vietnqw/vietnqw.github.io`**:
  - Ensure GitHub Pages is enabled and your custom domain `vietngoquang.com` is configured (you already have this).

### Deploy

- Push to `main` in `vietnqw/leet-runner`, or run the workflow manually via **Actions**.
- Your site will update at **`vietngoquang.com/leet-runner`** after the workflow finishes.

### Local dev

```bash
npm install
npm run dev
```


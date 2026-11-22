# Damanpreet Singh Chadha | Cloud Solutions Architect Portfolio

A React + Vite portfolio designed for GitHub Pages, including a client-side Terraform destroy/restore simulation.

## Important: simulator safety

The Terraform Lifecycle Lab is a **visual simulation only**. It does not execute Terraform, call AWS APIs, run shell commands, or modify infrastructure. The terminal output and resource names are illustrative. The simulation resets when the page is refreshed.

## Run locally

Requirements: Node.js 20+ (Node.js 22 recommended).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`.

## Deploy to GitHub Pages

This project is configured for:

`https://damanpreet-cloud.github.io/Damanpreet-Profile/`

1. Add these files to the existing `Damanpreet-Profile` repository.
2. Commit and push to the `main` branch.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, select **GitHub Actions** as the source.
5. Open the **Actions** tab and confirm that `Deploy portfolio to GitHub Pages` completes successfully.

The workflow builds the site and publishes the `dist/` directory.

## Before publishing: personalize these items

Search the source for `YOUR_EMAIL_ADDRESS` and replace it with the professional email address you want displayed.

Review `src/data.js` and `src/App.jsx` carefully:
- Confirm role titles and company names.
- Add accurate employment dates if desired.
- Confirm every project description and outcome.
- Add a resume PDF at `public/resume.pdf` only when you have the final version.
- Add your own profile photo if you want one; the current hero uses a monogram, not a stock portrait.

## GitHub Pages base path

`vite.config.js` uses `/Damanpreet-Profile/` because this is a project site, not a user/organization root site. If you change the repository name, update `base` accordingly.

## Structure

```text
src/
  components/TerraformSimulator.jsx
  App.jsx
  data.js
  main.jsx
  styles.css
.github/workflows/deploy.yml
```

## Notes

- This is a static website. No backend or paid hosting is required.
- Google Fonts are loaded from Google Fonts; if external font loading is blocked, system fallback fonts are used.
- The deployment workflow uses GitHub Actions Pages artifacts.

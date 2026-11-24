# Damanpreet Singh Chadha | Cloud Solutions Architect Portfolio

A React + Vite portfolio designed for GitHub Pages, with an interactive Simulation Lab (Terraform lifecycle, keyless CI/CD, organization guardrails and AZ failover).

## Important: simulator safety

Everything in the Simulation Lab is a **visual simulation only**. It does not execute Terraform, call AWS or GitHub APIs, run shell commands, or modify infrastructure. Terminal output, trust policies, SCP results and failover timings are illustrative. The simulations reset when the page is refreshed.

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

## Before publishing: checklist

1. **Lock file.** Run `npm install` once locally and commit the generated `package-lock.json`. The deploy workflow uses `npm ci` when the lock file exists.
2. **Certifications.** `certifications` in `src/data.js` lists only exams you have passed. Move the Professional exam there only after you pass it.
3. **SFTP cost figures.** When you can verify the monthly cost before and after, add a "Financial impact" line to the SFTP case study in `src/data.js`.
4. **Savings claim.** The `$100K+` figure is cumulative, not annual. Keep it conservative and be ready to explain which initiatives it includes.
5. **Content review.** Confirm role titles, dates, the four case studies and every project outcome in `src/data.js`.

## GitHub Pages base path

`vite.config.js` uses `/Damanpreet-Profile/` because this is a project site, not a user/organization root site. If you change the repository name, update `base` accordingly.

## Structure

```text
public/            og-image.png, icon, manifest
src/
  components/SimulationLab.jsx, TerraformSimulator.jsx, CopyButton.jsx
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

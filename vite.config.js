import { existsSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The Download Resume button is shown only when public/resume.pdf exists.
const hasResume = existsSync(new URL("./public/resume.pdf", import.meta.url));
if (!hasResume) console.warn("[portfolio] public/resume.pdf not found: the Download Resume button will be hidden.");

export default defineConfig({
  plugins: [react()],
  define: { __HAS_RESUME__: JSON.stringify(hasResume) },
  // Required for the project GitHub Pages URL:
  // https://damanpreet-cloud.github.io/Damanpreet-Profile/
  base: "/Damanpreet-Profile/"
});

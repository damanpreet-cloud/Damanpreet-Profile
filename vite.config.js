import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Required for the project GitHub Pages URL:
  // https://damanpreet-cloud.github.io/Damanpreet-Profile/
  base: "/Damanpreet-Profile/"
});
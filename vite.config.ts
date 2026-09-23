import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const isPages = process.env.GITHUB_PAGES === 'true';
export default defineConfig({
  plugins: [react()],
  base: isPages ? '/CookSmart-ApplePie-Scroll/' : '/',
});

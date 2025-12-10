import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // IMPORTANT: Change 'dev-trunfo' to your actual repository name on GitHub
    base: '/dev-trunfo/', 
    define: {
      // This injects the process.env.API_KEY into the build
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});
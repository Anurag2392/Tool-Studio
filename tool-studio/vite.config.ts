import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const publisherId = process.env.VITE_ADSENSE_PUBLISHER_ID || 'ca-pub-1386075354518252';

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_ADSENSE_PUBLISHER_ID': JSON.stringify(publisherId),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      sourcemap: false,
      minify: 'esbuild' as const,
      cssMinify: true,
      reportCompressedSize: false,
    },
    esbuild: {
      drop: ['console', 'debugger'] as ('console' | 'debugger')[],
      legalComments: 'none' as const,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

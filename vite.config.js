import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';

import { defineConfig } from 'vite';
import path from 'path';


export default defineConfig({
    server: {
        host: 'localhost',
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
             ziggy: path.resolve('vendor/tightenco/ziggy'),
        },
    },
});

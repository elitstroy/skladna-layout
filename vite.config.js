import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
    root: 'src',
    base: './',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                'home': resolve(__dirname, 'src/view/home.html'),
                'home-v1': resolve(__dirname, 'src/view/home-v1.html'),
                'home-v2': resolve(__dirname, 'src/view/home-v2.html'),
                'ui-kit-forms': resolve(__dirname, 'src/view/ui-kit-forms.html'),
            }
        }
    },
    plugins: []
});
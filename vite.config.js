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
                'delivery': resolve(__dirname, 'src/view/delivery.html'),
                'ui-kit-forms': resolve(__dirname, 'src/view/ui-kit-forms.html'),
                'ui-kit-alerts': resolve(__dirname, 'src/view/ui-kit-alerts.html'),
            }
        }
    },
    plugins: []
});
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { fileURLToPath } from 'node:url';

const SRC_PATH = fileURLToPath(new URL('./src', import.meta.url));

// https://vite.dev/config/
export default defineConfig({
    base: './',
    plugins: [preact()],
    resolve: {
        alias: {
            '#': SRC_PATH,
        },
    },
});

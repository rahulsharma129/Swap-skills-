import { defineConfig } from "vite"; 
import react from "@vitejs/plugin-react"; 
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/ 
export default defineConfig({   
    plugins: [react()],   
    css: {
        postcss: {
            plugins: [tailwindcss()],
        },   
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:7777',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ''),
            }
        }
    }
});

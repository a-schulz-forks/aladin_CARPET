import {fileURLToPath, URL} from "node:url";

import {defineConfig, loadEnv} from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default ({mode}) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};
    return defineConfig({
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        isCustomElement: (tag) => ["GridLayout"].includes(tag)
                    }
                }
            })
        ],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url))
            }
        },
        server: {
            proxy: {
                "/api": {
                    target: process.env.VITE_API_URL,
                    changeOrigin: true
                }
            }
        }
    });
};
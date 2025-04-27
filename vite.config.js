import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import manifest from './addon/src/manifest.js'

const packageJson = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url)))

export default defineConfig({
    plugins: [
        vue(),
        {
            name: 'generate-manifest',
            apply: 'build',
            async generateBundle(_, bundle) {
                const finalManifest = {
                    ...manifest,
                    version: packageJson.version,
                    version_name: packageJson.version.split('.').slice(0, 2).join('.')
                }
                this.emitFile({
                    type: 'asset',
                    fileName: 'manifest.json',
                    source: JSON.stringify(finalManifest, null, 2)
                })
            }
        }
    ],
    root: 'addon/src',
    publicDir: '../public',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'addon/src/popup.html'),
                background: resolve(__dirname, 'addon/src/background/index.js'),
                operation: resolve(__dirname, 'addon/src/operation.html')
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        }
    }
})

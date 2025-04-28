import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import manifest from './addon/src/manifest.js'

const packageJson = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url)))

export default defineConfig({
    resolve: {
        alias: {
            '@src': resolve(__dirname, 'addon/src'),
            '@mock': resolve(__dirname, 'addon/src/mock'),
            '@background': resolve(__dirname, 'addon/src/background'),
            '@utils': resolve(__dirname, 'addon/src/utils'),
            '@content': resolve(__dirname, 'addon/src/contentScripts'),
            '@operations': resolve(__dirname, 'addon/src/operations'),
        }
    },
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
    define: {
        'process.env': {},
    },
    build: {
        outDir: '../dist',
        target: 'esnext',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'addon/src/popup.html'),
                background: resolve(__dirname, 'addon/src/background/index.js'),
                operation: resolve(__dirname, 'addon/src/operation.html'),
                initOrgContext: resolve(__dirname, 'addon/src/contentScripts/initOrgContext.js')
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        }
    }
})

import { createApp, defineAsyncComponent } from 'vue'
import { registerLicense } from '@syncfusion/ej2-base'
registerLicense(import.meta.env.EJ2_LICENSE_KEY)

// Extract ?op=query_builder
const urlParams = new URLSearchParams(window.location.search)
const opKey = urlParams.get('op')

// Scan for Page.vue files in src/operations
const pageModules = import.meta.glob('./operations/**/Page.vue')

// Build lookup map
const operationComponents = {}
for (const path in pageModules) {
    const match = path.match(/\.\/operations\/([^\/]+)\/Page\.vue$/)
    if (match) {
        const key = match[1] // we make the folder name the opKey
        operationComponents[key] = pageModules[path]
    }
}

// Fallback if opKey doesn't exist
const componentLoader = operationComponents[opKey] || (() => import('./popup.vue'))

const OperationComponent = defineAsyncComponent(componentLoader)

const app = createApp(OperationComponent)
app.mount('#app')

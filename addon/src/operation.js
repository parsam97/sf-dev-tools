import { createApp, defineAsyncComponent } from 'vue'

// Extract ?op=query_builder
const urlParams = new URLSearchParams(window.location.search)
const opKey = urlParams.get('op')

// Map operation keys to components dynamically
const operationComponents = {
    query_builder: () => import('./operations/queryBuilder/Page.vue'),
    record_compare: () => import('./operations/recordCompare/Page.vue')
}

const OperationComponent = defineAsyncComponent(operationComponents[opKey])

createApp(OperationComponent).mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import cytoscape from 'cytoscape'
// @ts-expect-error cytoscape-dagre has no default export type
import cytoscapeDagre from 'cytoscape-dagre'
import App from './App.vue'
import router from './router'

cytoscape.use(cytoscapeDagre)

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

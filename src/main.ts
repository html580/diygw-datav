import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import DiygwDatav from './index'
const app = createApp(App);
app.use(DiygwDatav).mount('#app')

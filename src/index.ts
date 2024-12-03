import type { App, Component } from 'vue'
type ModuleType = {
    [key: string]: {
        default: Component
    }
}
const modules: ModuleType = import.meta.glob('./components/*.vue', { eager: true }) as ModuleType

let components = []

for (const path in modules) {
    const comp = modules[path].default
    components.push(comp)
}

const install = (Vue: App) => {
    components.forEach(component => {
        Vue.component("Diygw" + component.name, component)
    });
}

export default {
    install
}


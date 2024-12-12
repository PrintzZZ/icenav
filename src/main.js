import './style.css'
import 'ant-design-vue/dist/reset.css'

import { createApp } from 'vue'
import App from './App.vue'
// import router from './router'
import Antd from 'ant-design-vue'
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'



const app = createApp(App)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)


// app.use(router)
app.use(Antd)
app.use(pinia);

app.mount('#IceoohNavigate')

console.group(window.location.host),
console.log("\n%c %s %c %s\n", "color: #fff; background: #34495e; padding:5px 0;", "冰屋数据", "background: #fadfa3; padding:5px 0;", "https://www.iceooh.com"),
console.log("%c 性能", "color:orange; font-weight: bold"),
console.groupEnd()

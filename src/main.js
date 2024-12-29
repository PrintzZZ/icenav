import './style.css'
// import 'ant-design-vue/dist/reset.css'

import { createApp } from 'vue'
import App from './App.vue'
// import router from './router'
import { Button, Table, Modal,ConfigProvider,Tooltip,Tabs,Input,InputNumber,Select,TimePicker,Image,Radio,Form,Card,Avatar,FloatButton,Popconfirm,Typography,Upload,Segmented,Slider,Switch,Tag,Skeleton   } from 'ant-design-vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 创建app
const app = createApp(App)

// 状态持久化
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)


// antd组件
app.use(Button);
app.use(Table);
app.use(Modal);
app.use(ConfigProvider);
app.use(Tooltip);
app.use(Tabs);
app.use(Input);
app.use(InputNumber);
app.use(Select);
app.use(TimePicker);
app.use(Image);
app.use(Radio);
app.use(Form);
app.use(Card);
app.use(Avatar);
app.use(FloatButton);
app.use(Popconfirm);
app.use(Typography);
app.use(Upload);
app.use(Segmented);
app.use(Slider);
app.use(Switch);
app.use(Tag);
app.use(Skeleton);

// 状态管理
app.use(pinia);

// 挂载
app.mount('#IceoohNavigate')

// 控制台
console.group(window.location.host),
console.log("\n%c %s %c %s\n", "color: #fff; background: #34495e; padding:5px 0;", "冰屋数据", "background: #fadfa3; padding:5px 0;", "https://www.iceooh.com"),
console.log("%c 性能", "color:orange; font-weight: bold"),
console.groupEnd()

# IceNav - 冰屋学术导航

![Logo](/public/images/favicon.png)

一个优雅的学术导航网站，集成了文献检索、热点资讯、AI工具等功能。

## 🌟 特性

- 📚 集成多个学术搜索引擎
- 🤖 收录主流AI工具和平台
- 🔥 实时热点资讯聚合
- 💫 流畅的动画效果
- 📱 响应式设计，支持移动端
- ⚡ 基于 Vue 3 + Vite 构建
- 🎨 使用 Ant Design Vue 组件库
- 💾 支持本地数据持久化

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- npm >= 7

### 安装

```bash
# 克隆项目
git clone https://github.com/PrintzZZ/icenav.git

# 进入项目目录
cd icenav

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 配置

在 `.env` 文件中配置环境变量：

```env
VITE_API_URL=your_api_url
```

## 🔧 技术栈

- [Vue 3](https://v3.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Ant Design Vue](https://antdv.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Less](https://lesscss.org/)

## 📦 项目结构

```
icenav/
├── public/              # 静态资源
├── src/
│   ├── components/      # 公共组件
│   ├── store/          # Pinia 状态管理
│   ├── views/          # 页面组件
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── .env                # 环境变量
└── vite.config.js      # Vite 配置
```

## 🎯 主要功能

1. 学术搜索
   - 支持多个搜索引擎切换
   - 快捷搜索建议
   - 搜索历史记录

2. 热点聚合
   - 实时热点展示
   - 多平台数据聚合
   - 支持自定义排序

3. AI工具导航
   - AI对话工具
   - AI图像工具
   - AI编程助手

4. 个性化设置
   - 自定义收藏
   - 主题切换
   - 布局调整

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

[MIT License](LICENSE)

## 🙏 鸣谢

- [Ant Design Vue](https://antdv.com/)
- [Vue.js](https://vuejs.org/)
- [Vite](https://vitejs.dev/)

## 📧 联系方式

- Website: [https://nav.iceooh.com](https://nav.iceooh.com)
- Email: [your-email@example.com](mailto:your-email@example.com)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=PrintzZZ/icenav&type=Date)](https://star-history.com/#PrintzZZ/icenav&Date)
```

这份README包含了以下主要内容：
1. 项目简介
这是一个纯静态的导航页面，支持pc端、ipad pro 横屏、手机端自适应适配。
允许用户自行设置搜索引擎与导航网站。
2. 使用的技术栈
vue3 + vite + pinia + less + axios + ant design vue
3. 项目启动和构建指令
```bash
npm run dev
npm run build
```

你可以根据实际项目需求，添加更多具体的内容，比如：
- 项目特性介绍
主界面搜索引擎支持更换背景，修改引擎信息添加、删除、排序、编辑
侧边栏导航支持排序，上传excel数据自动生成导航
主界面支持添加收藏，支持添加自定义收藏
热点模块默认显示5个，支持设置显示数量和排序

- API文档链接
涉及到今日热点的api，使用了基于开源的api服务，然后替换为自己部署的api


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

```bash
git config auto.core.CRLF true : 设置自动转换CRLF为LF
git fetch --all: 获取远程仓库的所有更新，不会修改本地代码。
git reset --hard origin/main: 强制将本地分支的代码重置为远程分支的状态.
git pull: 从远程仓库拉取最新的提交，确保本地代码是最新的。

git push -u origin main: 将本地分支的代码推送到远程仓库。

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

5. 数据导入导出
   - 支持数据导入导出


- API文档链接
涉及到今日热点的api，使用了基于开源的api服务，然后替换为自己部署的api

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




## 已经实现的功能

- 学术搜索
- 热点聚合
- AI工具导航
- 个性化设置
- 响应式设计
- 主题切换
- 布局调整
- 自定义收藏
- 支持自定义排序
- 支持多搜索引擎切换
- 支持主题切换
- 支持天气
- 支持本地数据持久化
- 支持数据导入导出

## 计划任务

- 云端数据持久化
- 待办事项和备忘录
- 第三方服务整合 接入 RSS 订阅、社交媒体小组件等



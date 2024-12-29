import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from "rollup-plugin-visualizer"

// https://vite.dev/config/
// 配置@为src
import path from 'path'
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    plugins: [vue(),visualizer({ open: true }) ],
    build: {
      compress: {
        drop_debugger: true, // 移除 debugger 语句
        drop_console: true, // 移除 console.log，减小体积
      },
      chunkSizeWarningLimit: 1000, // 设置 chunk 大小警告的阈值（单位 KB）
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js",
          assetFileNames: "[ext]/[name]-[hash].[ext]",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("node_modules/.pnpm")) return;
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
      reportCompressedSize: false, //  gzip 压缩大小报告。
      sourcemap: false, // 是否生成map文件
    },
    define: {
      'process.env': env
    }
  }
})

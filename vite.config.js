import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue()],
    build: {
      compress: {
        drop_console: true, // 移除 console.log，减小体积
      },
      chunkSizeWarningLimit: 500, // 设置 chunk 大小警告的阈值（单位 KB）
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

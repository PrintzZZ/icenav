import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { visualizer } from "rollup-plugin-visualizer";
import { viteExternalsPlugin } from 'vite-plugin-externals'

// https://vite.dev/config/
// 配置@为src
import path from "path";
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    plugins: [
      vue(),
      visualizer({
        open: true,
      }),
      viteExternalsPlugin({
        lodash: "_",
        xlsx: "XLSX",
      }),
    ],
    build: {
      compress: {
        drop_debugger: true, // 移除 debugger 语句
        drop_console: true, // 移除 console.log，减小体积
      },
      minify: true, // 启用代码压缩
      chunkSizeWarningLimit: 1000, // 设置 chunk 大小警告的阈值（单位 KB）
      rollupOptions: {
        external: ['lodash','xlsx'],
        output: {
          globals: {
            lodash: "_",
            xlsx: "XLSX",
          },
          manualChunks(id) {
            if (id.includes("node_modules")) {
              // 按需拆分常用第三方库
              if (id.includes("ant-design-vue")) return "antdv";
              if (id.includes("axios")) return "axios";
              if (id.includes("dayjs")) return "dayjs";
              return "vendor"; // 其他第三方依赖统一归入 vendor
            }
          },
        },
      },
      reportCompressedSize: false, //  gzip 压缩大小报告。
      sourcemap: false, // 是否生成map文件
    },
    define: {
      "process.env": env,
    },
  };
});

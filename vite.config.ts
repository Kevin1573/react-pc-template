import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";
import mockDevServerPlugin from "vite-plugin-mock-dev-server";
import { defineConfig } from "vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";

// 当前工作目录路径
const root = process.cwd();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mockDevServerPlugin(), // 提供开发环境的 Mock 服务
    removeConsole({ includes: ["log", "warn", "info"] }), // 生产环境移除指定的 console 语句
    createSvgIconsPlugin({
      iconDirs: [path.resolve(root, "src/assets/icons/svg")], // 指定svg图标文件夹
      symbolId: "icon-[dir]-[name]", // 指定 symbolId 格式
    }),
  ],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    hmr: true, // 热更新
    open: true, // 自动打开浏览器
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/mock": { target: "" }, // Mock 专用: https://github.com/pengzhanbo/vite-plugin-mock-dev-server
      // "/v1": {
      //   target: "http://localhost:8999", // 代理地址
      //   changeOrigin: true, // 是否跨域
      //   rewrite: (path) => path.replace(/^\/v1/, "/v1"), // 重写路径
      // },
    },
  },
  css: { preprocessorOptions: { scss: { api: "modern" } } },
  build: {
    chunkSizeWarningLimit: 2500, // 消除打包大小超过500kb(默认值)的警告
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, ".", "index.html"),
      },
      output: {
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        },
      },
    },
  },
});

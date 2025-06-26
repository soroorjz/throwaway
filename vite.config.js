// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     open: true,
//     proxy: {
//       "/api": {
//         target: "http://localhost:3000",
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/api/, "/api"),
//         configure: (proxy, _options) => {
//           proxy.on("error", (err, _req, _res) => {
//             console.error("Proxy error:", err);
//           });
//           proxy.on("proxyReq", (proxyReq, req, _res) => {
//             console.log("Sending Request to the Target:", req.method, req.url);
//           });
//           proxy.on("proxyRes", (proxyRes, req, _res) => {
//             console.log(
//               "Received Response from the Target:",
//               proxyRes.statusCode,
//               req.url
//             );
//           });
//         },
//       },
//     },
//   },
//   root: path.resolve(__dirname, "public"),
//   publicDir: path.resolve(__dirname, "public"),
//   base: "/",
//   build: {
//     outDir: path.resolve(__dirname, "dist"),
//   },
//   resolve: {
//     alias: {
//       "/src": path.resolve(__dirname, "src"),
//     },
//   },
// });

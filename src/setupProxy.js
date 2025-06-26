const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://smp.devrayan.ir/api/",
      changeOrigin: true,
      secure: false, // SSL
    })
  );
};

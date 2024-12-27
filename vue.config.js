const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  proxy: {
    "/lang": {
      target: "http://43.203.214.173:5300", // HTTP 백엔드 주소
      changeOrigin: true,
      pathRewrite: { "^/lang": "" },
    },
  },
});

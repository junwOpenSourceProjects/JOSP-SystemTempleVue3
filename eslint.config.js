module.exports = [
  {
    files: ["*.js", "*.ts", "*.vue"],
    languageOptions: {
      parser: "vue-eslint-parser", // 确保这个解析器已安装
      parserOptions: {
        parser: "@typescript-eslint/parser", // 确保这个解析器已安装
        ecmaVersion: "latest",
        sourceType: "module",
        // 其他 parserOptions 可能需要的配置
      },
      globals: {
        // 使用 globals 替换 env 中的全局变量
        OptionType: "readonly",
        browser: "readonly",
        es2021: "readonly",
        node: "readonly",
      },
    },
    plugins: {
      vue: require.resolve("eslint-plugin-vue"), // 确保路径正确
      "@typescript-eslint": require.resolve("@typescript-eslint/eslint-plugin"), // 确保路径正确
      prettier: require.resolve("eslint-plugin-prettier"), // 确保路径正确
    },
    rules: {
      ...require("eslint-plugin-vue/lib/configs/vue3-recommended").rules,
      ...require("@typescript-eslint/eslint-plugin/dist/configs/recommended")
        .rules,
      ...require("eslint-config-prettier").rules,
      // 自定义规则
    },
  },
  {
    files: ["*.html"],
    processor: "vue/.vue", // 确保这个处理器已安装
    languageOptions: {
      parser: "vue-eslint-parser", // 同样需要确保这个解析器已安装
      globals: {
        // 定义全局变量
      },
    },
    plugins: {
      vue: require.resolve("eslint-plugin-vue"),
      prettier: require.resolve("eslint-plugin-prettier"),
    },
    rules: {
      ...require("eslint-plugin-vue/lib/configs/vue3-recommended").rules,
      ...require("eslint-config-prettier").rules,
      // 自定义规则
    },
  },
];

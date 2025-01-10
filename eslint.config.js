// eslint.config.js (ESLint v9向け)
export default [
    {
      ignores: ["node_modules", "dist"], // ①無視するパス
      files: ["**/*.js", "**/*.mjs"],    // ②対象ファイル
      
      languageOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
      },
  
      plugins: {
        // import, prettierなど
      },
  
      rules: {
        // ルール設定
        "no-console": "warn",
      },
    },
  ];
  
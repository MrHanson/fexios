module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],

  rules: {
    "no-trailing-spaces": ["error", { "skipBlankLines": true }],
    semi: ["error", "never"],
    quotes: ["warn", "single"],
    "no-var": "error",
  },
};

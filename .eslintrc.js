module.exports = {
  env: {
    browser: true,
    es2021: true,
  },

  extends: [
    "plugin:react/recommended",
    "airbnb/base",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",

  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },

  plugins: ["react", "@typescript-eslint"],
  rules: {
    "import/prefer-default-export": 0,
    "no-restricted-exports": 0,
    "arrow-body-style": 0,
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
  },
};

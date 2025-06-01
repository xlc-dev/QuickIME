import tseslint from "typescript-eslint";
import solid from "eslint-plugin-solid";
import eslintPluginPrettier from "eslint-plugin-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  jsxA11y.flatConfigs.strict,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      solid: solid,
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          useTabs: false,
          tabWidth: 2,
          singleQuote: false,
          semi: true,
          trailingComma: "es5",
          bracketSameLine: true,
          printWidth: 99,
          endOfLine: "lf",
          plugins: ["prettier-plugin-tailwindcss"],
        },
      ],

      "solid/jsx-no-duplicate-props": ["error", { ignoreCase: false }],
      "solid/jsx-uses-vars": "error",
      "solid/no-innerhtml": ["error", { allowStatic: false }],
      "solid/jsx-no-script-url": "error",
      "solid/no-destructure": "error",
      "solid/prefer-for": "error",
      "solid/jsx-no-undef": ["error", { typescriptEnabled: true, autoImport: true }],
      "solid/components-return-once": "error",
      "solid/reactivity": "error",
      "solid/event-handlers": ["error", { ignoreCase: false, warnOnSpread: true }],
      "solid/imports": "error",
      "solid/style-prop": ["error", { allowString: false }],
      "solid/no-react-deps": "error",
      "solid/no-react-specific-props": "error",
      "solid/self-closing-comp": ["error", { component: "all", html: "all" }],
      "solid/no-array-handlers": "error",
      "solid/prefer-show": "error",
      "solid/no-proxy-apis": "error",
      "solid/prefer-classlist": "error",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/prefer-readonly": "warn",
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
    },
  }
);

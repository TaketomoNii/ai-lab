// eslint.config.js (flat config)
// Minimal flat config for Next.js 14+ / 16 with TypeScript + Prettier
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import next from "eslint-config-next";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  next,
  prettier,
  {
    ignores: ["**/.next/**", "**/node_modules/**", "**/dist/**"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json", "./apps/*/tsconfig.json"],
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    },
  },
];

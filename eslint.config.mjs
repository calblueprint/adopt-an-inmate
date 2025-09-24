import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import plugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintPluginPrettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules",
      "dist",
      ".next",
      "build",
      ".vscode",
      "next-env.d.ts",
      "setup-scripts",
    ],
  },
  {
    files: ["/**/*.ts"],
    plugins: {
      prettier: eslintPluginPrettier,
      "@typescript-eslint": plugin,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-shadow": "error",
    },
  },
];

export default eslintConfig;

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const reactCompilerPlugin = require("eslint-plugin-react-compiler");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

const convexQueryImportsRule = {
  rules: {
    "no-restricted-imports": [
      "warn",
      {
        paths: [
          {
            name: "convex/react",
            importNames: ["useQuery", "useQueries"],
            message:
              "Import useQuery and useQueries from convex-helpers/react/cache instead of convex/react",
          },
          {
            name: "@react-navigation/bottom-tabs",
            importNames: ["useBottomTabBarHeight"],
            message:
              "Import useBottomTabBarHeight from @/hooks/useBottomTabBarHeight instead of @react-navigation/bottom-tabs to ensure proper cross-platform behavior",
          },
        ],
      },
    ],
  },
};

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      "react-compiler": reactCompilerPlugin,
    },
    rules: {
      "react-compiler/react-compiler": "error", // or "warn"
    },
  },
  convexQueryImportsRule,
  {
    ignores: ["dist/*", "/.expo/**", "node_modules/**"],
  },
]);

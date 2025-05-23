import { ConfigContext, ExpoConfig } from "expo/config";

const APP_VARIANT = process.env.APP_VARIANT;
const IS_DEV = APP_VARIANT === "development";
const IS_PREVIEW = APP_VARIANT === "preview";

const baseIdentifier = "com.jaronheard.expoconvexclerktemplate";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return `${baseIdentifier}.dev`;
  }

  if (IS_PREVIEW) {
    return `${baseIdentifier}.preview`;
  }

  return baseIdentifier;
};

const getAppName = () => {
  if (IS_DEV) {
    return "Expo Convex Clerk Template (Dev)";
  }

  if (IS_PREVIEW) {
    return "Expo Convex Clerk Template (Preview)";
  }

  return "Expo Convex Clerk Template";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "expo-convex-clerk-template",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "expo-convex-clerk-template",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  updates: {
    checkAutomatically: "ON_ERROR_RECOVERY",
  },
  ios: {
    ...config.ios,
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    ...config.android,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    package: getUniqueIdentifier(),
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "expo-localization",
    [
      "@sentry/react-native/expo",
      {
        organization: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        url: "https://sentry.io/",
        note: "Use SENTRY_AUTH_TOKEN env to authenticate with Sentry, and SENTRY_ORG and SENTRY_PROJECT to set the organization and project.",
      },
    ],
    ["onesignal-expo-plugin", { mode: "development" }],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    criticalIndex: 0,
    router: {},
    eas: {
      projectId: "c69d86f9-5820-4628-aca5-37c5b69a46ca",
    },
  },
});

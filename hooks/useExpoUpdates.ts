import { useEffect } from "react";
import { AppState } from "react-native";
import * as Updates from "expo-updates";

const TEN_MINUTES = 10 * 60 * 1000;

async function checkAndApplyUpdate() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      const currentCritical =
        (Updates.manifest as any)?.extra?.criticalIndex ?? 0;
      const availableCritical =
        (update.manifest as any)?.extra?.criticalIndex ?? 0;
      await Updates.fetchUpdateAsync();
      if (availableCritical > currentCritical) {
        await Updates.reloadAsync();
      }
    }
  } catch (e) {
    console.log("update check failed", e);
  }
}

export function useExpoUpdates(interval: number = TEN_MINUTES) {
  useEffect(() => {
    checkAndApplyUpdate();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkAndApplyUpdate();
      }
    });

    const id = setInterval(checkAndApplyUpdate, interval);
    return () => {
      clearInterval(id);
      subscription.remove();
    };
  }, [interval]);
}

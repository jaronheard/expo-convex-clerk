import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();
  const systemColorScheme = useRNColorScheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Sync the NativeWind theme with the system setting
  useEffect(() => {
    if (
      systemColorScheme &&
      (!colorScheme || colorScheme !== systemColorScheme)
    ) {
      setColorScheme(systemColorScheme);
    }
  }, [systemColorScheme, colorScheme, setColorScheme]);

  if (!hasHydrated) {
    return {
      colorScheme: "light",
      isDarkColorScheme: false,
      setColorScheme,
      toggleColorScheme,
    };
  }

  return {
    colorScheme: colorScheme ?? "light",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
  };
}

import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();
  const systemColorScheme = useRNColorScheme();

  // Effect to sync with system theme on initial load
  useEffect(() => {
    if (
      systemColorScheme &&
      (!colorScheme || colorScheme !== systemColorScheme)
    ) {
      setColorScheme(systemColorScheme);
    }
  }, [systemColorScheme, colorScheme, setColorScheme]);

  return {
    colorScheme: colorScheme ?? "dark",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
  };
}

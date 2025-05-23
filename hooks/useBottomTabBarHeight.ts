import { useBottomTabBarHeight as useRNBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";

export function useBottomTabBarHeight(): number {
  const tabBarHeight = useRNBottomTabBarHeight();

  // Return 0 on web, actual height on mobile
  return Platform.OS === "web" ? 0 : tabBarHeight;
}

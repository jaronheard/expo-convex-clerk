import { Text, type TextProps } from "react-native";
import { cn } from "@/lib/utils";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  className,
  ...rest
}: ThemedTextProps & { className?: string }) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[{ color }, style]}
      className={cn(
        type === "default" && "text-base leading-6",
        type === "title" && "text-4xl font-bold leading-[32px]",
        type === "defaultSemiBold" && "text-base leading-6 font-semibold",
        type === "subtitle" && "text-xl font-bold",
        type === "link" && "text-base leading-[30px] text-[#0a7ea4]",
        className,
      )}
      {...rest}
    />
  );
}

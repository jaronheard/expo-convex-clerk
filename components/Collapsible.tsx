import { PropsWithChildren, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { colorScheme } = useColorScheme();
  const theme = colorScheme ?? "light";

  return (
    <View className="bg-background">
      <TouchableOpacity
        className="flex-row items-center gap-1.5"
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <View style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}>
          <IconSymbol
            name="chevron.right"
            size={18}
            weight="medium"
            color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
          />
        </View>

        <Text className="font-semibold text-base">{title}</Text>
      </TouchableOpacity>
      {isOpen && <View className="bg-background mt-1.5 ml-6">{children}</View>}
    </View>
  );
}

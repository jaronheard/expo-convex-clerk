import { SymbolView, SymbolViewProps, SymbolWeight } from "expo-symbols";

import { cn } from "@/lib/utils";

export function IconSymbol({
  name,
  size = 24,
  color,
  className,
  weight = "regular",
}: {
  name: SymbolViewProps["name"];
  size?: number;
  color: string;
  className?: string;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      className={cn(`w-[${size}px] h-[${size}px]`, className)}
    />
  );
}

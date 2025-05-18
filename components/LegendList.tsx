import React from "react";
import { FlatList, ListRenderItem } from "react-native";

export type LegendListProps<ItemT> = {
  data: ItemT[];
  renderItem: ListRenderItem<ItemT>;
  keyExtractor: (item: ItemT, index: number) => string;
  onEndReached: () => void;
  isDone: boolean;
};

export function LegendList<ItemT>({
  data,
  renderItem,
  keyExtractor,
  onEndReached,
  isDone,
}: LegendListProps<ItemT>) {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={() => {
        if (!isDone) onEndReached();
      }}
    />
  );
}

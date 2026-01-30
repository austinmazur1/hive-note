import { AddItemFab } from "@/features/home/components/add-item-fab";
import { PreviewGrid } from "@/features/home/components/preview-grid";
import { SearchBar } from "@/features/home/components/search-bar";
import { supabase } from "@/lib/supabase";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Linking, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
// import Animated, {} from "react-native-reanimated";

// TODO: Implement empty state
// TODO: Implement search functionality
// TODO: Replace callback with tanstack query

export function HomeScreen() {

  const [previewItems, setPreviewItems] = useState<any[]>([]);

  const fetchPreviewItems = useCallback(async () => {
    const { data, error } = await supabase.from("items").select("*");
    if (error) {
      console.error("error", error);
    }
    setPreviewItems(data || []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPreviewItems();
    }, [fetchPreviewItems]),
  );

  return (
    <View className="flex-1 pt-safe">
      <PreviewGrid
        items={previewItems || []}
        onItemPress={(id) => {
          Linking.openURL(id);
        }}
      />
      <KeyboardStickyView offset={{opened: 80}}>
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center gap-6 px-4 py-4">
        <SearchBar
          placeholder="Search"
          onChangeText={(text) => console.log("Search text:", text)}
        />
        <AddItemFab
          onPress={() => router.push("/(app)/(auth)/(modal)/(items)/new-item")}
        />
      </View>
      </KeyboardStickyView>
    </View>
  );
}
import { AddItemFab } from "@/features/home/components/add-item-fab";
import { PreviewGrid } from "@/features/home/components/preview-grid";
import { SearchBar } from "@/features/home/components/search-bar";
import { supabase } from "@/lib/supabase";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// TODO: Implement empty state
// TODO: Implement search functionality
// TODO: Replace callback with tanstack query

export default function Home() {
  const [previewItems, setPreviewItems] = useState<any[]>([]);
  const insets = useSafeAreaInsets();

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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PreviewGrid
        items={previewItems || []}
        onItemPress={(id) => {
          Linking.openURL(id);
        }}
      />
      <View style={styles.searchBarContent}>
        <SearchBar
          placeholder="Search"
          onChangeText={(text) => console.log("Search text:", text)}
        />
        <AddItemFab
          onPress={() => router.push("/(app)/(auth)/(modal)/(items)/new-item")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchBarContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "transparent",
  },
});

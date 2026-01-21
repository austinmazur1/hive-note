import { AddItemFab } from "@/components/home/AddItemFab";
import { PreviewGrid } from "@/components/home/PreviewGrid";
import { SearchBar } from "@/components/home/SearchBar";
import { useEffect, useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const [previewItems, setPreviewItems] = useState<any[]>([]);
  const insets = useSafeAreaInsets();

  const fetchPreviewItems = async () => {
    const response = await fetch('/api/preview');
    const data = await response.json();
    setPreviewItems([data.preview]);
  };

  useEffect(() => {
    fetchPreviewItems();
  }, []);

  if (previewItems.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PreviewGrid
        // items={MOCK_ITEMS}
        items={previewItems || []}
        onItemPress={(id) => {
          Linking.openURL(id);
          fetchPreviewItems();
          console.log('Pressed:', id)}}
      />
      <View style={styles.searchBarContent}>
        <SearchBar placeholder="Search" onChangeText={(text) => console.log('Search text:', text)} />
        <AddItemFab onPress={() => console.log('Add item')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchBarContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
});
import { AddItemFab } from "@/components/home/AddItemFab";
import { PreviewGrid } from "@/components/home/PreviewGrid";
import { SearchBar } from "@/components/home/SearchBar";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK_ITEMS = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  { id: '3', title: 'Item 3' },
  { id: '4', title: 'Item 4' },
  { id: '5', title: 'Item 5' },
  { id: '6', title: 'Item 6' },
  { id: '7', title: 'Item 7' },
  { id: '8', title: 'Item 8' },
  { id: '9', title: 'Item 9' },
  { id: '10', title: 'Item 10' },
  { id: '11', title: 'Item 11' },
  { id: '12', title: 'Item 12' },
  { id: '13', title: 'Item 13' },
  { id: '14', title: 'Item 14' },
  { id: '15', title: 'Item 15' },
  { id: '16', title: 'Item 16' },
  { id: '17', title: 'Item 17' },
  { id: '18', title: 'Item 18' },
  { id: '19', title: 'Item 19' },
  { id: '20', title: 'Item 20' },
];

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PreviewGrid
        items={MOCK_ITEMS}
        onItemPress={(id) => console.log('Pressed:', id)}
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
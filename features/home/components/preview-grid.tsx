import { Image } from 'expo-image';
import { FlatList, Linking, Pressable, StyleSheet, useWindowDimensions } from 'react-native';

const GAP = 12;
const HORIZONTAL_PADDING = 16;

export interface PreviewGridProps {
  items: any[];
  onItemPress: (id: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  contentContainerClassName?: string;
}
// TODO: Replace with Flashlist or LegendList
export const PreviewGrid = ({ items, onItemPress, onRefresh, isLoading, contentContainerClassName }: PreviewGridProps) => {
  const { width } = useWindowDimensions();
  const itemWidth = (width - HORIZONTAL_PADDING * 2 - GAP) / 2;

  return (
    <FlatList
      data={items}
      numColumns={2}
      className='flex-1 w-full'
      contentContainerClassName={contentContainerClassName ?? 'px-4 pt-4 pb-10 gap-3 shadow-sm shadow-black/5'}
      columnWrapperClassName='justify-between'
      renderItem={({ item }) => {
        return (
          <Pressable
            style={[styles.itemContainer, { width: itemWidth, height: itemWidth }]}
            onPress={() => {
              if (item.type === 'screenshot') {
                Linking.openURL(item.image);
                return;
              }
              onItemPress(item.content.url);
            }}>
            <Image
              style={styles.itemImage}
              source={{ uri: item.image }}
              placeholder={{ blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' }}
              contentFit="cover"
              transition={1000}
            />
          </Pressable>
        );
      }}
      keyExtractor={(item) => item.url || item.id}
      onRefresh={onRefresh}
      refreshing={isLoading ?? false}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 16,
    backgroundColor: '#E5E5E5',
    overflow: 'hidden',
  },
  itemImage: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0553',
  },
});

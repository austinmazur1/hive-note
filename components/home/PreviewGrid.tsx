import { Image } from "expo-image";
import { FlatList, Pressable, StyleSheet, useWindowDimensions } from "react-native";

const GAP = 12;
const HORIZONTAL_PADDING = 16;

export interface PreviewGridProps {
    items: any[];
    onItemPress: (id: string) => void;
    onRefresh?: () => void;
    isLoading?: boolean;
}

export const PreviewGrid = ({ items, onItemPress, onRefresh, isLoading }: PreviewGridProps) => {
    const { width } = useWindowDimensions();
    const itemWidth = (width - HORIZONTAL_PADDING * 2 - GAP) / 2;
    console.log("ITEMS", typeof items);

    return (
        <FlatList
            data={items}
            numColumns={2}
            style={styles.list}
            contentContainerStyle={styles.contentContainer}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => {
                console.log("ITEM", item);
                return (
                <Pressable
                    style={[styles.itemContainer, { width: itemWidth, height: itemWidth }]}
                    onPress={() => onItemPress(item.url)}
                >
                    <Image
                        style={styles.itemImage}
                        source={{ uri: item.images[0] }}
                        placeholder={{ blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' }}
                        contentFit="cover"
                        transition={1000}
                    />
                </Pressable>
            )}}
            keyExtractor={(item) => item.url || item.id}
            onRefresh={onRefresh}
            refreshing={isLoading ?? false}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
        width: '100%',
    },
    contentContainer: {
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingTop: 16,
        paddingBottom: 100,
        gap: GAP,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    itemContainer: {
        borderRadius: 16,
        backgroundColor: '#E5E5E5',
        overflow: 'hidden',
    },
    itemImage: {
        flex: 1,
        width: '100%',
        // height: '100%',
        backgroundColor: '#0553',
    },
});

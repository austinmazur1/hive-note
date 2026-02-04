import { Text } from "@/components/ui/text";
import { PreviewGrid } from "@/features/home/components/preview-grid";
import { useSupabase } from "@/lib/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    Pressable,
    View
} from "react-native";

export function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const supabase = useSupabase();
  const [collection, setCollection] = useState<{ id: string; name: string } | null>(null);
  const [itemDetails, setItemDetails] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const refetch = useCallback(async () => {
    if (!id) return;
    const { data: collectionData, error: collectionError } = await supabase
      .from("collections")
      .select("id, name")
      .eq("id", id)
      .single();
    if (collectionError) {
      console.error("collection error", collectionError);
      return;
    }
    setCollection(collectionData);

    const { data: collectionItems, error: itemsError } = await supabase
      .from("collection_items")
      .select("item_id")
      .eq("collection_id", id);
    if (itemsError) {
      console.error("collection_items error", itemsError);
      setItemDetails([]);
      return;
    }
    const itemIds = (collectionItems ?? []).map((row) => row.item_id);
    if (itemIds.length === 0) {
      setItemDetails([]);
      return;
    }
    const { data: items, error: detailsError } = await supabase
      .from("items")
      .select("*")
      .in("id", itemIds);
    if (detailsError) {
      console.error("items fetch error", detailsError);
      setItemDetails([]);
      return;
    }
    setItemDetails(items ?? []);
  }, [id, supabase]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const openAddItems = useCallback(() => {
    router.push({
      pathname: "/(app)/(auth)/(modal)/(collections)/add-to-collection",
      params: { collectionId: id },
    });
  }, [id, router]);

  if (!collection) {
    return (
      <View className="flex-1 bg-background pt-safe items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background pt-safe">
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <Text variant="h3" numberOfLines={1} className="flex-1 mr-3">
          {collection.name}
        </Text>
        <Pressable
          onPress={openAddItems}
          className="flex-row items-center gap-1.5 rounded-lg bg-muted px-3 py-2 active:opacity-80"
        >
          <Ionicons name="add" size={20} color="hsl(0 0% 45.1%)" />
          <Text variant="small" className="text-muted-foreground">
            Add items
          </Text>
        </Pressable>
      </View>
      {itemDetails.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-muted">
            <Ionicons
              name="images-outline"
              size={48}
              color="hsl(0 0% 45.1%)"
            />
          </View>
          <Text variant="h3" className="text-center">
            No items in this collection
          </Text>
          <Text
            variant="muted"
            className="mt-2 text-center"
            style={{ maxWidth: 280 }}
          >
            Add items from your saves or create new ones.
          </Text>
          <Pressable
            onPress={openAddItems}
            className="mt-8 flex-row items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 active:opacity-90"
          >
            <Ionicons name="add" size={22} color="white" />
            <Text className="font-semibold text-primary-foreground">
              Add items
            </Text>
          </Pressable>
        </View>
      ) : (
        <PreviewGrid
          items={itemDetails}
          onItemPress={(url) => Linking.openURL(url)}
          onRefresh={onRefresh}
          isLoading={refreshing}
          contentContainerClassName="px-4 pt-2 pb-24 gap-3"
        />
      )}
    </View>
  );
}

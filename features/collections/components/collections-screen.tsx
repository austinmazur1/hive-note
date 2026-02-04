import { Text } from "@/components/ui/text";
import { useSupabase } from "@/lib/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  View,
  useWindowDimensions,
} from "react-native";

const COVER_PLACEHOLDER = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";
const GAP = 12;
const HORIZONTAL_PADDING = 16;

type Collection = {
  id: string;
  name: string;
  cover?: string | null;
  created_at?: string;
};

/** First item per collection (by created_at) for cover fallback */
function useCollectionCovers(
  supabase: ReturnType<typeof useSupabase>,
  collectionIds: string[],
) {
  const [firstItemByCollection, setFirstItemByCollection] = useState<
    Record<string, { image: string }>
  >({});

  useFocusEffect(
    useCallback(() => {
      if (collectionIds.length === 0) {
        setFirstItemByCollection({});
        return;
      }
      let cancelled = false;
      (async () => {
        try {
          const { data: items } = await supabase
            .from("items")
            .select("id, image, collection_id, created_at")
            .in("collection_id", collectionIds)
            .order("created_at", { ascending: true });

          if (cancelled || !items) return;
          const firstByCollection: Record<string, { image: string }> = {};
          for (const item of items) {
            const cid = (item as { collection_id?: string }).collection_id;
            if (cid && item.image && !firstByCollection[cid]) {
              firstByCollection[cid] = { image: item.image };
            }
          }
          setFirstItemByCollection(firstByCollection);
        } catch {
          setFirstItemByCollection({});
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [supabase, collectionIds.join(",")]),
  );

  return firstItemByCollection;
}

function getCoverPhoto(
  collection: Collection,
  firstItemByCollection: Record<string, { image: string }>,
): string | null {
  if (collection.cover) return collection.cover;
  const first = firstItemByCollection[collection.id];
  return first?.image ?? null;
}

export function CollectionsScreen() {
  const router = useRouter();
  const supabase = useSupabase();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);
  const { width } = useWindowDimensions();
  const cardWidth = (width - HORIZONTAL_PADDING * 2 - GAP) / 2;

  const collectionIds = useMemo(
    () => collections.map((c) => c.id),
    [collections],
  );
  const firstItemByCollection = useCollectionCovers(supabase, collectionIds);

  const fetchCollections = useCallback(async () => {
    const { data, error } = await supabase
      .from("collections")
      .select("id, name, cover, created_at")
      .order("created_at", { ascending: false });
    if (error) console.error("collections fetch error", error);
    setCollections((data as Collection[]) ?? []);
  }, [supabase]);

  useFocusEffect(
    useCallback(() => {
      fetchCollections();
    }, [fetchCollections]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCollections();
    setRefreshing(false);
  }, [fetchCollections]);

  const createCollection = useCallback(async () => {
    setCreating(true);
    const { data, error } = await supabase
      .from("collections")
      .insert({ name: "New Collection" })
      .select()
      .single();
    setCreating(false);
    if (error) {
      console.error("create collection error", error);
      return;
    }
    setCollections((prev) => [data as Collection, ...prev]);
  }, [supabase]);

  const coverPhoto = (c: Collection) =>
    getCoverPhoto(c, firstItemByCollection);

  if (collections.length === 0) {
    return (
      <View className="flex-1 bg-background pt-safe">
        <View className="flex-1 items-center justify-center px-8">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-muted">
            <Ionicons
              name="library-outline"
              size={48}
              color="hsl(0 0% 45.1%)"
            />
          </View>
          <Text variant="h3" className="text-center">
            No collections yet
          </Text>
          <Text
            variant="muted"
            className="mt-2 text-center"
            style={{ maxWidth: 280 }}>
            Group your saves into collections. Create one to get started.
          </Text>
          <Pressable
            onPress={createCollection}
            disabled={creating}
            className="mt-8 min-w-[200] flex-row items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 active:opacity-90">
            {creating ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="add" size={22} color="white" />
                <Text className="font-semibold text-primary-foreground">
                  Create collection
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background pt-safe">
      <FlatList
        data={collections}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pt-5 pb-10 gap-3"
        columnWrapperClassName="justify-between"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View className="mb-1 flex-row items-center justify-between px-0.5">
            <Text variant="h3">Collections</Text>
            <Pressable
              onPress={createCollection}
              disabled={creating}
              className="flex-row items-center gap-1.5 rounded-lg bg-muted px-3 py-2 active:opacity-80">
              {creating ? (
                <ActivityIndicator size="small" />
              ) : (
                <>
                  <Ionicons name="add" size={20} color="hsl(0 0% 45.1%)" />
                  <Text variant="small" className="text-muted-foreground">
                    New
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const cover = coverPhoto(item);
          return (
            <Pressable
              style={{ width: cardWidth }}
              className="rounded-2xl bg-card overflow-hidden border border-border shadow-sm active:opacity-95"
              onPress={() => {
                router.push(`/(app)/(auth)/(tabs)/collections/${item.id}`);
              }}>
              <View style={{ width: cardWidth, height: cardWidth * 0.7 }}>
                {cover ? (
                  <Image
                    source={{ uri: cover }}
                    placeholder={{ blurhash: COVER_PLACEHOLDER }}
                    contentFit="cover"
                    transition={300}
                    style={{ width: "100%", height: "100%", backgroundColor: "hsl(0 0% 96.1%)" }}
                  />
                ) : (
                  <View className="h-full w-full items-center justify-center bg-muted">
                    <Ionicons
                      name="images-outline"
                      size={32}
                      color="hsl(0 0% 63.9%)"
                    />
                  </View>
                )}
              </View>
              <View className="border-t border-border px-3 py-2.5">
                <Text
                  variant="default"
                  numberOfLines={1}
                  className="font-semibold text-foreground">
                  {item.name}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

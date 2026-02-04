import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useSession } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

type InputType = "link" | "screenshot";

type Collection = { id: string; name: string };

// hasShareIntent true
//  LOG  shareIntent {"files": null, "meta": {}, "text": "https://www.youtube.com/watch?v=qMDSJPekxBw", "type": "weburl", "webUrl": "https://www.youtube.com/watch?v=qMDSJPekxBw"}

// TODO: Refactor and break up into smaller components
export function NewItemScreen() {
  const { session } = useSession();
  const supabase = useSupabase();
  const { hasShareIntent, shareIntent, error, resetShareIntent } =
    useShareIntentContext();
  const [inputType, setInputType] = useState<InputType>("link");
  const [link, setLink] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>(
    [],
  );
  const [newCollectionName, setNewCollectionName] = useState("");

  const fetchCollections = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from("collections")
      .select("id, name")
      .order("created_at", { ascending: false });
    if (fetchError) console.error("collections fetch error", fetchError);
    setCollections((data as Collection[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  useEffect(() => {
    console.log("hasShareIntent", hasShareIntent);
    console.log("shareIntent", shareIntent);
    console.log("error", error);
    if (hasShareIntent) {
      shareIntent.type === "weburl"
        ? setInputType("link")
        : setInputType("screenshot");
      setLink(shareIntent.webUrl || "");
    } else {
      setInputType("screenshot");
      setScreenshot(null);
    }
  }, [hasShareIntent]);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setScreenshot(result.assets[0].uri);
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async () => {
    const token = await session?.getToken();
    const item = {
      type: inputType,
      content: inputType === "link" ? link : screenshot,
      tags,
      ...(selectedCollectionIds.length > 0 && {
        collectionIds: selectedCollectionIds,
      }),
      ...(newCollectionName.trim() && {
        newCollectionName: newCollectionName.trim(),
      }),
    };
    const response = await fetch("/api/preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(item),
    });
    if (response.ok) {
      router.back();
      router.prefetch("/home");
    }
  };

  const canSave =
    (inputType === "link" && link.trim()) ||
    (inputType === "screenshot" && screenshot);

  return (
    <KeyboardAwareScrollView
    className="flex-1"
    // contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} >
            <Text className="text-lg font-medium text-secondary">Cancel</Text>
          </Pressable>
          <Text className="text-lg font-medium text-secondary">New Item</Text>
          <Pressable
            onPress={handleSave}
            className={cn(!canSave && "opacity-50")}
            disabled={!canSave}
          >
            <Text className={cn(!canSave && "text-gray-500", "text-lg font-medium")}>
              Save
            </Text>
          </Pressable>
        </View>
        <View 
        className="flex-row items-center bg-gray-100 p-1 rounded-md gap-2 mt-6 mx-4">
          <Pressable
            className={cn("flex-1 flex-row items-center justify-center gap-2 rounded-md p-3 text-black",inputType === "link" && "bg-black text-white")}
            onPress={() => setInputType("link")}
          >
            <Ionicons
              name="link"
              size={20}
              color={inputType === "link" ? "#fff" : "#666"}
            />
            <Text
              className={cn("text-sm font-medium text-black",inputType === "link" && "text-white")}
            >
              Link
            </Text>
          </Pressable>
          <Pressable
          className={cn("flex-1 flex-row items-center justify-center gap-2 rounded-md p-3",inputType === "screenshot" && "bg-black")}
            onPress={() => setInputType("screenshot")}
          >
            <Ionicons
              name="image"
              size={20}
              color={inputType === "screenshot" ? "#fff" : "#666"}
            />
            <Text
              className={cn("text-sm font-medium text-black",inputType === "screenshot" && "text-white")}
            >
              Screenshot
            </Text>
          </Pressable>
        </View>
        <View className="mt-8 px-4">
          <Text className="font-medium mb-2 text-gray-500">
            {inputType === "link" ? "Paste URL" : "Upload Screenshot"}
          </Text>

          {inputType === "link" ? (
            <View 
            className="flex-row items-center bg-gray-100 p-2 rounded-md gap-2">
              <Ionicons name="globe-outline" size={20} color="#999" />
              <TextInput
                className="flex-1 text-base items-center"
                placeholder="https://example.com"
                placeholderTextColor="#999"
                value={link}
                onChangeText={setLink}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              {link.length > 0 && (
                <Pressable onPress={() => setLink("")}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </Pressable>
              )}
            </View>
          ) : (
            <Pressable 
            className="rounded-md overflow-hidden"
            onPress={pickImage}>
              {screenshot ? (
                <View className="relative">
                  <Image
                    source={{ uri: screenshot }}
                    style={styles.screenshotImage}
                  />
                  <Pressable
                  className="absolute top-2 right-2 rounded-full p-2"
                    onPress={() => setScreenshot(null)}
                  >
                    <Ionicons name="close-circle" size={24} color="#fff" />
                  </Pressable>
                </View>
              ) : (
                <View 
                className="bg-gray-100 rounded-md border-2 border-gray-200 border-dashed py-16 items-center justify-center gap-2"
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={40}
                    color="#999"
                  />
                  <Text className="text-sm font-medium text-gray-400">
                    Tap to select an image
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
        <View
        className="mt-8 px-4">
          <Text className="font-medium mb-2 text-gray-500">Tags</Text>
          <View className="flex-row items-center gap-2 bg-gray-100 p-2 rounded-md">
            <Ionicons name="pricetag-outline" size={20} color="#999" />
            <TextInput
              className="flex-1 text-base"
              placeholder="Add a tag..."
              placeholderTextColor="#999"
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={addTag}
              returnKeyType="done"
              autoCapitalize="none"
            />
            {tagInput.length > 0 && (
              <Pressable onPress={addTag} className="bg-black p-2 rounded-md">
                <Text className="text-sm font-medium text-white">Add</Text>
              </Pressable>
            )}
          </View>

          {tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Pressable
                  key={tag}
                  className="flex-row items-center gap-2 bg-gray-100 p-2 rounded-md"
                  onPress={() => removeTag(tag)}
                >
                  <Text className="text-sm font-medium">{tag}</Text>
                  <Ionicons name="close" size={14} color="#666" />
                </Pressable>
              ))}
            </View>
          )}
        </View>
        <View className="mt-8 px-4">
          <Text className="font-medium mb-2 text-gray-500">
            Collections
          </Text>
          <Popover>
            <PopoverTrigger asChild>
              <Pressable className="flex-row items-center justify-between rounded-lg border border-input bg-background px-4 py-3 min-h-[48px]">
                <View className="flex-row items-center gap-3 flex-1 min-w-0">
                  <Ionicons name="folder-outline" size={22} color="#999" />
                  <Text
                    variant="default"
                    className={cn(
                      selectedCollectionIds.length === 0 &&
                        !newCollectionName.trim() &&
                        "text-muted-foreground",
                    )}
                    numberOfLines={2}
                  >
                    {selectedCollectionIds.length === 0 &&
                    !newCollectionName.trim()
                      ? "Select collections..."
                      : [
                          ...selectedCollectionIds
                            .map(
                              (id) =>
                                collections.find((c) => c.id === id)?.name,
                            )
                            .filter(Boolean),
                          newCollectionName.trim() &&
                            `New: ${newCollectionName.trim()}`,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#999" />
              </Pressable>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              sideOffset={8}
              className="w-[min(100%,340px)] rounded-xl border border-border bg-popover p-0 shadow-lg"
            >
              <ScrollView
                style={{ maxHeight: 320 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 16 }}
              >
                <Pressable
                  className="flex-row items-center gap-3 px-5 py-4 active:bg-muted"
                  onPress={() => {
                    setSelectedCollectionIds([]);
                    setNewCollectionName("");
                  }}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={22}
                    color="#666"
                  />
                  <Text variant="default">Clear all</Text>
                </Pressable>
                <Separator />
                {collections.length === 0 ? (
                  <View className="px-5 py-4">
                    <Text variant="small" className="text-muted-foreground">
                      No collections yet. Create one below.
                    </Text>
                  </View>
                ) : (
                  collections.map((c) => {
                    const isSelected = selectedCollectionIds.includes(c.id);
                    return (
                      <Pressable
                        key={c.id}
                        className="flex-row items-center gap-4 px-5 py-4 active:bg-muted"
                        onPress={() =>
                          setSelectedCollectionIds((prev) =>
                            isSelected
                              ? prev.filter((id) => id !== c.id)
                              : [...prev, c.id],
                          )
                        }
                      >
                        <Ionicons
                          name={isSelected ? "checkbox" : "square-outline"}
                          size={24}
                          color={isSelected ? "#000" : "#999"}
                        />
                        <Text variant="default" numberOfLines={1}>
                          {c.name}
                        </Text>
                      </Pressable>
                    );
                  })
                )}
                <Separator />
                <View className="px-5 py-4 gap-2 pb-6">
                  <Text variant="small" className="text-muted-foreground">
                    Create new collection
                  </Text>
                  <Input
                    placeholder="Collection name..."
                    value={newCollectionName}
                    onChangeText={setNewCollectionName}
                    className="min-h-[44px] text-base"
                  />
                </View>
              </ScrollView>
            </PopoverContent>
          </Popover>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  screenshotImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
});

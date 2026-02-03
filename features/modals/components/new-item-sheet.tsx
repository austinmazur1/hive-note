import { cn } from "@/lib/utils";
import { useSession } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type InputType = "link" | "screenshot";

// hasShareIntent true
//  LOG  shareIntent {"files": null, "meta": {}, "text": "https://www.youtube.com/watch?v=qMDSJPekxBw", "type": "weburl", "webUrl": "https://www.youtube.com/watch?v=qMDSJPekxBw"}

// TODO: Refactor and break up into smaller components
export function NewItemScreen() {
  const {session} = useSession();
  const { hasShareIntent, shareIntent, error, resetShareIntent } =
    useShareIntentContext();
  const [inputType, setInputType] = useState<InputType>("link");
  const [link, setLink] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

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
    <KeyboardAvoidingView
    className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} >
            <Text className="text-lg font-medium">Cancel</Text>
          </Pressable>
          <Text className="text-lg font-medium">New Item</Text>
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
            className={cn("flex-1 flex-row items-center justify-center gap-2 rounded-md p-3",inputType === "link" && "bg-black")}
            onPress={() => setInputType("link")}
          >
            <Ionicons
              name="link"
              size={20}
              color={inputType === "link" ? "#fff" : "#666"}
            />
            <Text
              className={cn("text-sm font-medium",inputType === "link" && "text-white")}
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
              className={cn("text-sm font-medium",inputType === "screenshot" && "text-white")}
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
      </View>
    </KeyboardAvoidingView>
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

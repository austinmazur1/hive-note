import { Fonts } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

type InputType = "link" | "screenshot";

export default function NewItem() {
  const [inputType, setInputType] = useState<InputType>("link");
  const [link, setLink] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

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

  const handleSave = () => {
    const item = {
      type: inputType,
      content: inputType === "link" ? link : screenshot,
      tags,
    };
    console.log("Saving item:", item);
    // TODO: Implement save logic
    router.back();
  };

  const canSave =
    (inputType === "link" && link.trim()) ||
    (inputType === "screenshot" && screenshot);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={styles.scrollView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>New Item</Text>
          <Pressable
            onPress={handleSave}
            style={[styles.headerButton, !canSave && styles.disabledButton]}
            disabled={!canSave}
          >
            <Text style={[styles.saveText, !canSave && styles.disabledText]}>
              Save
            </Text>
          </Pressable>
        </View>

        {/* Type Selector */}
        <View style={styles.typeSelector}>
          <Pressable
            style={[
              styles.typeOption,
              inputType === "link" && styles.typeOptionActive,
            ]}
            onPress={() => setInputType("link")}
          >
            <Ionicons
              name="link"
              size={20}
              color={inputType === "link" ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.typeOptionText,
                inputType === "link" && styles.typeOptionTextActive,
              ]}
            >
              Link
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.typeOption,
              inputType === "screenshot" && styles.typeOptionActive,
            ]}
            onPress={() => setInputType("screenshot")}
          >
            <Ionicons
              name="image"
              size={20}
              color={inputType === "screenshot" ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.typeOptionText,
                inputType === "screenshot" && styles.typeOptionTextActive,
              ]}
            >
              Screenshot
            </Text>
          </Pressable>
        </View>

        {/* Content Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {inputType === "link" ? "Paste URL" : "Upload Screenshot"}
          </Text>

          {inputType === "link" ? (
            <View style={styles.linkInputContainer}>
              <Ionicons name="globe-outline" size={20} color="#999" />
              <TextInput
                style={styles.linkInput}
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
            <Pressable style={styles.imagePickerContainer} onPress={pickImage}>
              {screenshot ? (
                <View style={styles.screenshotPreview}>
                  <Image
                    source={{ uri: screenshot }}
                    style={styles.screenshotImage}
                  />
                  <Pressable
                    style={styles.removeImageButton}
                    onPress={() => setScreenshot(null)}
                  >
                    <Ionicons name="close-circle" size={24} color="#fff" />
                  </Pressable>
                </View>
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="cloud-upload-outline" size={40} color="#999" />
                  <Text style={styles.imagePlaceholderText}>
                    Tap to select an image
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        </View>

        {/* Tags Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tags</Text>
          <View style={styles.tagInputContainer}>
            <Ionicons name="pricetag-outline" size={20} color="#999" />
            <TextInput
              style={styles.tagInput}
              placeholder="Add a tag..."
              placeholderTextColor="#999"
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={addTag}
              returnKeyType="done"
              autoCapitalize="none"
            />
            {tagInput.length > 0 && (
              <Pressable onPress={addTag} style={styles.addTagButton}>
                <Text style={styles.addTagButtonText}>Add</Text>
              </Pressable>
            )}
          </View>

          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag) => (
                <Pressable
                  key={tag}
                  style={styles.tag}
                  onPress={() => removeTag(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: Fonts.poppinsSemiBold,
    color: "#000",
  },
  cancelText: {
    fontSize: 16,
    fontFamily: Fonts.poppins,
    color: "#666",
  },
  saveText: {
    fontSize: 16,
    fontFamily: Fonts.poppinsSemiBold,
    color: "#007AFF",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#999",
  },
  typeSelector: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 4,
  },
  typeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  typeOptionActive: {
    backgroundColor: "#000",
  },
  typeOptionText: {
    fontSize: 15,
    fontFamily: Fonts.poppinsMedium,
    color: "#666",
  },
  typeOptionTextActive: {
    color: "#fff",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: Fonts.poppinsMedium,
    color: "#666",
    marginBottom: 10,
  },
  linkInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  linkInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.poppins,
    color: "#000",
  },
  imagePickerContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  imagePlaceholder: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    fontFamily: Fonts.poppins,
    color: "#999",
  },
  screenshotPreview: {
    position: "relative",
  },
  screenshotImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
  },
  tagInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  tagInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.poppins,
    color: "#000",
  },
  addTagButton: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addTagButtonText: {
    fontSize: 14,
    fontFamily: Fonts.poppinsMedium,
    color: "#fff",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    fontFamily: Fonts.poppins,
    color: "#333",
  },
});
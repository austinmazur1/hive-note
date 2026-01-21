import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TextInput, View } from "react-native";

export interface SearchBarProps {
    placeholder: string;
    onChangeText: (text: string) => void;
}

export const SearchBar = ({ placeholder, onChangeText }: SearchBarProps) => {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={24} color="black" />
            <TextInput
                placeholder={placeholder}
                onChangeText={onChangeText}
                style={styles.textInput}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderRadius: 100,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    textInput: {
        fontSize: 16,
        fontWeight: '400',
        color: '#000',
    },
});
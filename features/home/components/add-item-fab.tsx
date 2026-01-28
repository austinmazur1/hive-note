import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from "react-native";

interface AddItemFabProps {
    onPress?: () => void;
}

export const AddItemFab = ({ onPress }: AddItemFabProps) => {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <Ionicons name="add" size={24} color="white" />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 44,
        height: 44,
        backgroundColor: '#000',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from "react-native";

interface AddItemFabProps {
    onPress?: () => void;
}

export const AddItemFab = ({ onPress }: AddItemFabProps) => {
    return (
        <Pressable className='w-10 h-10 bg-secondary rounded-full justify-center items-center' onPress={onPress}>
            <Ionicons name="add" size={24} color="white" />
        </Pressable>
    );
};
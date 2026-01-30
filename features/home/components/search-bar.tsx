import { Input } from '@/components/ui/input';
import { View } from 'react-native';

export interface SearchBarProps {
  placeholder: string;
  onChangeText: (text: string) => void;
}

export const SearchBar = ({ placeholder, onChangeText }: SearchBarProps) => {
  return (
    <View className="flex-1">
      <Input
        placeholder={placeholder}
        onChangeText={onChangeText}
        showSearchIcon
        className="rounded-full text-base"
      />
    </View>
  );
};

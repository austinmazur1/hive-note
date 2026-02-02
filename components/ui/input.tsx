import { cn } from '@/lib/utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform, TextInput, View, type TextInputProps } from 'react-native';

type InputProps = TextInputProps &
  React.RefAttributes<TextInput> & {
    showSearchIcon?: boolean;
    placeholderClassName?: string;
  };

function Input({
  className,
  placeholderClassName,
  showSearchIcon = false,
  ...props
}: InputProps) {
  const inputElement = (
    <TextInput
      className={cn(
        'flex h-10 w-full min-w-0 flex-row items-center rounded-md border border-input bg-background px-3 py-2 text-base leading-5 text-foreground shadow-sm shadow-black/5 dark:bg-background sm:h-9',
        showSearchIcon && 'pl-10',
        props.editable === false &&
          cn(
            'opacity-50',
            Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
          ),
        Platform.select({
          web: cn(
            'outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground md:text-sm',
            'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
          ),
          native: 'placeholder:text-muted-foreground/50',
        }),
        className
      )}
      {...props}
    />
  );

  if (showSearchIcon) {
    return (
      <View className="relative w-full">
        <View className="absolute left-3 top-0 z-10 h-10 flex-row items-center justify-center sm:h-9" pointerEvents="none">
          <Ionicons name="search" size={18} color="#6b7280" />
        </View>
        {inputElement}
      </View>
    );
  }

  return inputElement;
}

export { Input };

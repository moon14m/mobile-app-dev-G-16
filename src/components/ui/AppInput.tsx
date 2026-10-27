import { Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '@/theme/tokens';

type Props = TextInputProps & { label: string; error?: string };

export function AppInput({ label, error, multiline, ...inputProps }: Props) {
  return (
    <View className="gap-1">
      <Text className="text-xs font-semibold text-muted">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.placeholder}
        multiline={multiline}
        className={`rounded-md border bg-white px-3 py-2.5 text-base text-ink ${multiline ? 'min-h-24' : ''} ${error ? 'border-bad' : 'border-line'}`}
        style={multiline ? { textAlignVertical: 'top' } : undefined}
        {...inputProps}
      />
      {!!error && <Text className="text-xs text-bad">{error}</Text>}
    </View>
  );
}

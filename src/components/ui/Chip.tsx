import { Pressable, Text } from 'react-native';

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`rounded-full border px-3 py-1.5 ${selected ? 'border-brand bg-brand-soft' : 'border-line bg-white'}`}>
      <Text className={`text-xs font-semibold ${selected ? 'text-brand' : 'text-muted'}`}>{label}</Text>
    </Pressable>
  );
}

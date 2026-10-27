import { Text, View } from 'react-native';

export function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="gap-1">
      <Text className="text-2xl font-bold text-ink">{title}</Text>
      {!!subtitle && <Text className="text-sm text-muted">{subtitle}</Text>}
    </View>
  );
}

export function SectionTitle({ children }: { children: string }) {
  return <Text className="mt-2 text-base font-bold text-ink">{children}</Text>;
}

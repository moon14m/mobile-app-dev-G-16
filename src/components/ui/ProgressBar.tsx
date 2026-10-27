import { View } from 'react-native';

export function ProgressBar({ value }: { value: number }) {
  const width = Math.min(100, Math.max(0, value));
  return (
    <View className="h-2 overflow-hidden rounded-full bg-line" accessibilityLabel={`${width} percent complete`}>
      <View className={`h-2 rounded-full ${width === 100 ? 'bg-good' : 'bg-brand'}`} style={{ width: `${width}%` }} />
    </View>
  );
}

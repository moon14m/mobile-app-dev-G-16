import { Pressable, Text, View } from 'react-native';

type Props = { value: number; onChange?: (stars: number) => void };

export function StarRating({ value, onChange }: Props) {
  return (
    <View className="flex-row gap-1" accessibilityLabel={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = <Text className={`text-lg ${n <= value ? 'text-amber-500' : 'text-line'}`}>★</Text>;
        return onChange ? (
          <Pressable key={n} accessibilityRole="button" accessibilityLabel={`${n} stars`} onPress={() => onChange(n)} hitSlop={4}>
            {star}
          </Pressable>
        ) : (
          <View key={n}>{star}</View>
        );
      })}
    </View>
  );
}

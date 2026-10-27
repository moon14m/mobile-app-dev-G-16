import { Pressable, Text, View } from 'react-native';

type Props = { title: string; detail: string; done: boolean; canMark: boolean; onOpen: () => void; onToggle: () => void };

// One lecture or lab in the course page, with a tick box for students.
export function ItemRow({ title, detail, done, canMark, onOpen, onToggle }: Props) {
  return (
    <View className="flex-row items-center gap-3 border-b border-line py-3">
      {canMark && (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={`Mark ${title} as done`}
          onPress={onToggle}
          hitSlop={8}
          className={`h-6 w-6 items-center justify-center rounded border ${done ? 'border-good bg-good' : 'border-line bg-white'}`}>
          {done && <Text className="text-xs font-bold text-white">✓</Text>}
        </Pressable>
      )}
      <Pressable accessibilityRole="button" onPress={onOpen} className="flex-1">
        <Text className={`font-semibold ${done ? 'text-muted' : 'text-ink'}`}>{title}</Text>
        <Text className="text-xs text-muted">{detail}</Text>
      </Pressable>
      <Text className="text-brand">›</Text>
    </View>
  );
}

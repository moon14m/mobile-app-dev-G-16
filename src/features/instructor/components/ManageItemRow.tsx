import { Pressable, Text, View } from 'react-native';

type Props = { title: string; detail: string; onEdit?: () => void; onDelete: () => void };

// One lecture, lab, quiz or announcement in the Manage screen.
export function ManageItemRow({ title, detail, onEdit, onDelete }: Props) {
  return (
    <View className="flex-row items-center gap-3 border-b border-line py-3">
      <View className="flex-1">
        <Text className="font-semibold text-ink">{title}</Text>
        <Text className="text-xs text-muted">{detail}</Text>
      </View>
      {onEdit && (
        <Pressable accessibilityRole="button" onPress={onEdit} hitSlop={8}>
          <Text className="text-xs font-semibold text-brand">Edit</Text>
        </Pressable>
      )}
      <Pressable accessibilityRole="button" onPress={onDelete} hitSlop={8}>
        <Text className="text-xs font-semibold text-bad">Delete</Text>
      </Pressable>
    </View>
  );
}

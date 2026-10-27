import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFound() {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-page p-6">
      <Stack.Screen options={{ title: 'Not found' }} />
      <Text className="text-lg font-semibold text-ink">This page does not exist.</Text>
      <Link href="/" className="font-semibold text-brand">
        Back to the app
      </Link>
    </View>
  );
}

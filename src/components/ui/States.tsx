import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '@/theme/tokens';
import { AppButton } from './AppButton';

export function LoadingView({ label = 'Loading…' }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-page p-6">
      <ActivityIndicator color={colors.brand} />
      <Text className="text-sm text-muted">{label}</Text>
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-page p-6">
      <Text className="text-center text-bad">{message}</Text>
      {onRetry && <AppButton label="Try again" variant="outline" onPress={onRetry} />}
    </View>
  );
}

export function EmptyState({ message, actionLabel, onAction }: { message: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View className="items-center gap-3 rounded-lg border border-dashed border-line px-6 py-8">
      <Text className="text-center text-muted">{message}</Text>
      {actionLabel && onAction && <AppButton label={actionLabel} variant="outline" small onPress={onAction} />}
    </View>
  );
}

// Full-screen message for pages the user is not allowed to open.
export function NoAccess({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <View className="flex-1 bg-page p-4">
      <EmptyState message={message} actionLabel="Go back" onAction={onBack} />
    </View>
  );
}

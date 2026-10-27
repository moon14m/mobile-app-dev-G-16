import { PropsWithChildren } from 'react';
import { Pressable, View } from 'react-native';

type Props = PropsWithChildren<{ onPress?: () => void; className?: string }>;

export function Card({ onPress, className = '', children }: Props) {
  const style = `gap-2 rounded-lg border border-line bg-white p-4 ${className}`;
  if (!onPress) return <View className={style}>{children}</View>;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} className={`${style} active:bg-page`}>
      {children}
    </Pressable>
  );
}

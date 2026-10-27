import { Pressable, Text } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  small?: boolean;
  disabled?: boolean;
};

export function AppButton({ label, onPress, variant = 'primary', small = false, disabled = false }: Props) {
  const box = {
    primary: 'bg-brand border-brand',
    outline: 'bg-white border-line',
    danger: 'bg-white border-red-200',
  }[variant];
  const text = { primary: 'text-white', outline: 'text-ink', danger: 'text-bad' }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`items-center justify-center rounded-md border active:opacity-70 ${small ? 'px-3 py-2' : 'px-4 py-3'} ${box} ${disabled ? 'opacity-40' : ''}`}>
      <Text className={`font-semibold ${small ? 'text-xs' : 'text-sm'} ${text}`}>{label}</Text>
    </Pressable>
  );
}

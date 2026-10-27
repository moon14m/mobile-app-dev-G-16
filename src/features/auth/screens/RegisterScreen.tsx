import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { Chip } from '@/components/ui/Chip';
import { useRegisterViewModel } from '../hooks/useRegisterViewModel';

export default function RegisterScreen() {
  const vm = useRegisterViewModel();

  function handleRegister() {
    if (vm.submit()) router.replace('/');
  }

  return (
    <ScrollView className="bg-page" contentContainerClassName="gap-4 p-6" keyboardShouldPersistTaps="handled">
      <Text className="text-muted">Student accounts only. Instructor accounts are created by the faculty.</Text>
      <AppInput label="Full name" value={vm.form.name} onChangeText={vm.update('name')} error={vm.errors.name} />
      <AppInput
        label="University email"
        value={vm.form.email}
        onChangeText={vm.update('email')}
        error={vm.errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <AppInput
        label="Student ID"
        value={vm.form.studentId}
        onChangeText={vm.update('studentId')}
        error={vm.errors.studentId}
        keyboardType="number-pad"
        maxLength={6}
      />
      <AppInput label="Password" value={vm.form.password} onChangeText={vm.update('password')} error={vm.errors.password} secureTextEntry />

      <View className="gap-2">
        <Text className="text-xs font-semibold text-muted">Department</Text>
        <View className="flex-row flex-wrap gap-2">
          {vm.departments.map((d) => (
            <Chip key={d} label={d} selected={d === vm.department} onPress={() => vm.setDepartment(d)} />
          ))}
        </View>
      </View>

      {!!vm.formError && <Text className="text-sm text-bad">{vm.formError}</Text>}
      <AppButton label="Create account" onPress={handleRegister} />
    </ScrollView>
  );
}

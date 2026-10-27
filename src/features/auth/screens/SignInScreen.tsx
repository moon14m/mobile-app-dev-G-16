import { Link, router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ErrorView, LoadingView } from '@/components/ui/States';
import { useSignInViewModel } from '../hooks/useSignInViewModel';

export default function SignInScreen() {
  const vm = useSignInViewModel();

  if (vm.loading) return <LoadingView />;
  if (vm.error) return <ErrorView message={vm.error} />;

  function handleSignIn() {
    if (vm.submit()) router.replace('/');
  }

  return (
    <ScrollView className="bg-page" contentContainerClassName="flex-grow justify-center gap-6 px-6 py-12" keyboardShouldPersistTaps="handled">
      <View className="gap-1">
        <Text className="text-sm font-semibold text-brand">FormaLearn</Text>
        <Text className="text-3xl font-bold text-ink">Sign in</Text>
        <Text className="text-muted">Use your university email to see your courses.</Text>
      </View>

      <View className="gap-4">
        <AppInput
          label="Email"
          value={vm.email}
          onChangeText={vm.setEmail}
          error={vm.errors.email}
          placeholder="name@formalearn.edu"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <AppInput label="Password" value={vm.password} onChangeText={vm.setPassword} error={vm.errors.password} secureTextEntry />
        {!!vm.formError && <Text className="text-sm text-bad">{vm.formError}</Text>}
        <AppButton label="Sign in" onPress={handleSignIn} />
      </View>

      <View className="flex-row justify-center gap-1">
        <Text className="text-muted">New student?</Text>
        <Link href="/register" className="font-semibold text-brand">
          Create an account
        </Link>
      </View>

      <View className="gap-1 rounded-lg border border-line bg-white p-4">
        <Text className="text-xs font-semibold text-muted">Test accounts</Text>
        <Text className="text-sm text-ink">Student: student@formalearn.edu / student123</Text>
        <Text className="text-sm text-ink">Instructor: instructor@formalearn.edu / instructor123</Text>
      </View>
    </ScrollView>
  );
}

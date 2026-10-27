import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/Heading';
import { ErrorView, LoadingView } from '@/components/ui/States';
import { InfoRow } from '../components/InfoRow';
import { useProfileViewModel } from '../hooks/useProfileViewModel';

export default function ProfileScreen() {
  const vm = useProfileViewModel();
  const user = vm.user;

  if (!user) return null;
  if (vm.loading) return <LoadingView />;
  if (vm.error) return <ErrorView message={vm.error} onRetry={vm.retry} />;

  function handleSignOut() {
    vm.signOut();
    router.replace('/sign-in');
  }

  async function handleReset() {
    await vm.resetDemoData();
    router.replace('/sign-in');
  }

  return (
    <ScrollView contentContainerClassName="gap-4 p-4">
      <View className="items-center gap-2 py-4">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-brand">
          <Text className="text-2xl font-bold text-white">{vm.initials}</Text>
        </View>
        <Text className="text-xl font-bold text-ink">{user.name}</Text>
        <Text className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">{vm.isInstructor ? 'Instructor' : 'Student'}</Text>
      </View>

      <Card className="py-1">
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Department" value={user.department} />
        {user.studentId && <InfoRow label="Student ID" value={user.studentId} />}
        <InfoRow label={vm.isInstructor ? 'Courses taught' : 'Enrolled courses'} value={String(vm.courseCount)} />
      </Card>

      {!vm.isInstructor && (
        <>
          <SectionTitle>Learning summary</SectionTitle>
          <Card className="py-1">
            <InfoRow label="Completed courses" value={String(vm.completed)} />
            <InfoRow label="Average progress" value={`${vm.average}%`} />
            <InfoRow label="Saved bookmarks" value={String(vm.bookmarkCount)} />
          </Card>
        </>
      )}

      <AppButton label="Log out" variant="danger" onPress={handleSignOut} />
      <AppButton label="Reset demo data" variant="outline" small onPress={handleReset} />
    </ScrollView>
  );
}

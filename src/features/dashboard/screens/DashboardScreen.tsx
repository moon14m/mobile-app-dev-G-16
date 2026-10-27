import { Redirect, router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Heading, SectionTitle } from '@/components/ui/Heading';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState, ErrorView, LoadingView } from '@/components/ui/States';
import { formatDate } from '@/utils/format';
import { useDashboardViewModel } from '../hooks/useDashboardViewModel';

export default function DashboardScreen() {
  const vm = useDashboardViewModel();

  if (vm.isInstructor) return <Redirect href="/catalog" />;
  if (vm.loading) return <LoadingView label="Loading your courses…" />;
  if (vm.error) return <ErrorView message={vm.error} onRetry={vm.retry} />;

  return (
    <ScrollView contentContainerClassName="gap-4 p-4">
      <Heading title={`Hello, ${vm.firstName}`} subtitle="Here is where you are in your courses." />

      <View className="flex-row rounded-lg border border-line bg-white">
        {vm.stats.map((s, i) => (
          <View key={s.label} className={`flex-1 p-3 ${i > 0 ? 'border-l border-line' : ''}`}>
            <Text className="text-xs text-muted">{s.label}</Text>
            <Text className="mt-1 text-xl font-bold text-ink">{s.value}</Text>
          </View>
        ))}
      </View>

      <SectionTitle>My courses</SectionTitle>
      {vm.myCourses.length === 0 ? (
        <EmptyState message="You are not enrolled in any course yet." actionLabel="Browse the catalog" onAction={() => router.navigate('/catalog')} />
      ) : (
        vm.myCourses.map((course) => (
          <Card key={course.id} onPress={() => router.push(`/course/${course.id}`)}>
            <Text className="text-xs font-semibold text-brand">{course.code}</Text>
            <Text className="text-lg font-semibold text-ink">{course.title}</Text>
            <View className="flex-row justify-between">
              <Text className="text-xs text-muted">{course.progress === 100 ? 'Completed' : 'In progress'}</Text>
              <Text className="text-xs font-bold text-ink">{course.progress}%</Text>
            </View>
            <ProgressBar value={course.progress} />
          </Card>
        ))
      )}

      <SectionTitle>Latest announcements</SectionTitle>
      {vm.latestAnnouncements.length === 0 ? (
        <EmptyState message="No announcements from your courses yet." />
      ) : (
        vm.latestAnnouncements.map((a) => (
          <Card key={a.id}>
            <Text className="text-xs text-muted">
              {a.courseCode} · {formatDate(a.date)}
            </Text>
            <Text className="font-semibold text-ink">{a.title}</Text>
            <Text className="text-sm text-muted">{a.body}</Text>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

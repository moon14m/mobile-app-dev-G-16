import { router } from 'expo-router';
import { FlatList, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState, ErrorView, LoadingView, NoAccess } from '@/components/ui/States';
import { plural } from '@/utils/format';
import { CoursePicker } from '../components/CoursePicker';
import { useStudentsProgressViewModel } from '../hooks/useStudentsProgressViewModel';

export default function StudentsProgressScreen() {
  const vm = useStudentsProgressViewModel();

  if (!vm.isInstructor) return <NoAccess message="Only instructors can see students' progress." onBack={() => router.back()} />;
  if (vm.loading) return <LoadingView label="Loading students…" />;
  if (vm.error) return <ErrorView message={vm.error} onRetry={vm.retry} />;
  if (vm.myCourses.length === 0) {
    return (
      <View className="flex-1 p-4">
        <EmptyState message="You do not teach any course yet." actionLabel="Add a course" onAction={() => router.navigate('/manage')} />
      </View>
    );
  }

  return (
    <FlatList
      data={vm.rows}
      keyExtractor={(row) => row.id}
      contentContainerClassName="gap-3 p-4"
      ListHeaderComponent={
        <View className="gap-3 pb-1">
          <CoursePicker courses={vm.myCourses} selectedId={vm.courseId} onSelect={vm.selectCourse} />
          <View>
            <Text className="text-lg font-bold text-ink">{vm.courseTitle}</Text>
            <Text className="text-sm text-muted">
              {plural(vm.rows.length, 'student')} · class average {vm.average}%
            </Text>
          </View>
        </View>
      }
      ListEmptyComponent={<EmptyState message="No students are enrolled in this course yet." />}
      renderItem={({ item }) => (
        <Card>
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="font-semibold text-ink">{item.name}</Text>
              <Text className="text-xs text-muted">{item.contact}</Text>
            </View>
            <Text className="text-lg font-bold text-ink">{item.progress}%</Text>
          </View>
          <ProgressBar value={item.progress} />
          <Text className="text-xs text-muted">{item.activity}</Text>
        </Card>
      )}
    />
  );
}

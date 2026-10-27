import { router } from 'expo-router';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { EmptyState, ErrorView, LoadingView } from '@/components/ui/States';
import { plural } from '@/utils/format';
import { CatalogAction, useCatalogViewModel } from '../hooks/useCatalogViewModel';

export default function CatalogScreen() {
  const vm = useCatalogViewModel();

  if (vm.loading) return <LoadingView label="Loading the catalog…" />;
  if (vm.error) return <ErrorView message={vm.error} onRetry={vm.retry} />;

  function renderAction(courseId: string, action: CatalogAction) {
    if (action === 'open') return <AppButton label="Open" small variant="outline" onPress={() => router.push(`/course/${courseId}`)} />;
    if (action === 'enroll') return <AppButton label="Enroll" small onPress={() => vm.enroll(courseId)} />;
    return <Text className="text-xs text-muted">Other instructor</Text>;
  }

  return (
    <FlatList
      data={vm.results}
      keyExtractor={(r) => r.course.id}
      contentContainerClassName="gap-3 p-4"
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View className="gap-3 pb-1">
          <AppInput label="Search" value={vm.search} onChangeText={vm.setSearch} placeholder="Course title or code" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
            {vm.departments.map((d) => (
              <Chip key={d} label={d} selected={d === vm.department} onPress={() => vm.setDepartment(d)} />
            ))}
          </ScrollView>
          <Text className="text-xs text-muted">{plural(vm.results.length, 'course')}</Text>
        </View>
      }
      ListEmptyComponent={<EmptyState message="No courses found. Try another title, code or department." />}
      renderItem={({ item }) => (
        <Card>
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="text-xs font-semibold text-brand">
                {item.course.code} · {item.course.credits} credits
              </Text>
              <Text className="text-base font-semibold text-ink">{item.course.title}</Text>
              <Text className="text-xs text-muted">
                {item.course.department} · {item.instructorName}
              </Text>
            </View>
            {renderAction(item.course.id, item.action)}
          </View>
          <Text className="text-sm text-muted">{item.course.description}</Text>
        </Card>
      )}
    />
  );
}

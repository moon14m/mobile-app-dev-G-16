import { FlatList, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { EmptyState, ErrorView, LoadingView } from '@/components/ui/States';
import { formatDate } from '@/utils/format';
import { useAnnouncementsViewModel } from '../hooks/useAnnouncementsViewModel';

export default function AnnouncementsScreen() {
  const vm = useAnnouncementsViewModel();

  if (vm.loading) return <LoadingView label="Loading announcements…" />;
  if (vm.error) return <ErrorView message={vm.error} onRetry={vm.retry} />;

  const header = (
    <View className="flex-row gap-2 pb-1">
      <Chip label={`Announcements (${vm.news.length})`} selected={vm.tab === 'news'} onPress={() => vm.setTab('news')} />
      <Chip label={`Upcoming (${vm.events.length})`} selected={vm.tab === 'events'} onPress={() => vm.setTab('events')} />
    </View>
  );

  if (vm.tab === 'news') {
    return (
      <FlatList
        data={vm.news}
        keyExtractor={(a) => a.id}
        contentContainerClassName="gap-3 p-4"
        ListHeaderComponent={header}
        ListEmptyComponent={<EmptyState message={vm.emptyMessage} />}
        renderItem={({ item }) => (
          <Card>
            <Text className="text-xs text-muted">
              {item.courseCode} · {formatDate(item.date)}
            </Text>
            <Text className="font-semibold text-ink">{item.title}</Text>
            <Text className="text-sm text-muted">{item.body}</Text>
          </Card>
        )}
      />
    );
  }

  return (
    <FlatList
      data={vm.events}
      keyExtractor={(e) => e.id}
      contentContainerClassName="gap-3 p-4"
      ListHeaderComponent={header}
      ListEmptyComponent={<EmptyState message={vm.emptyMessage} />}
      renderItem={({ item }) => (
        <Card>
          <View className="flex-row items-center justify-between">
            <Text className={`rounded px-2 py-0.5 text-xs font-bold ${item.kind === 'Quiz' ? 'bg-amber-100 text-amber-800' : 'bg-brand-soft text-brand'}`}>
              {item.kind}
            </Text>
            <Text className="text-xs font-semibold text-ink">{formatDate(item.date)}</Text>
          </View>
          <Text className="font-semibold text-ink">{item.title}</Text>
          <Text className="text-xs text-muted">{item.courseCode}</Text>
        </Card>
      )}
    />
  );
}

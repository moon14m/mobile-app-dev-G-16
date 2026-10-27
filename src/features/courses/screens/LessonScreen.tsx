import { Redirect, router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/Heading';
import { EmptyState, ErrorView, LoadingView, NoAccess } from '@/components/ui/States';
import { formatDate, formatTime } from '@/utils/format';
import { VideoPlayer } from '../components/VideoPlayer';
import { useLessonViewModel } from '../hooks/useLessonViewModel';

export default function LessonScreen() {
  const { courseId, itemId } = useLocalSearchParams<{ courseId: string; itemId: string }>();
  const vm = useLessonViewModel(courseId, itemId);

  if (!vm.signedIn) return <Redirect href="/sign-in" />;
  if (vm.loading) return <LoadingView />;
  if (vm.error) return <ErrorView message={vm.error} onRetry={vm.retry} />;

  const { course, item, lecture, lab, player, bookmarkForm } = vm;
  if (!course || !item || !vm.allowed) {
    return <NoAccess message="This lesson is only open to students enrolled in the course." onBack={() => router.back()} />;
  }

  return (
    <ScrollView contentContainerClassName="gap-4 p-4" keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: lecture ? 'Lecture' : 'Lab' }} />

      <View className="gap-1">
        <Text className="text-xs font-semibold text-brand">
          {course.code} · {lecture ? `${lecture.durationMin} min lecture` : `Lab due ${formatDate(lab!.dueDate)}`}
        </Text>
        <Text className="text-2xl font-bold text-ink">{item.title}</Text>
      </View>

      {lecture && (
        <VideoPlayer
          title={lecture.videoTitle}
          position={player.position}
          duration={player.duration}
          playing={player.playing}
          onTogglePlay={player.togglePlay}
          onSeek={player.seek}
        />
      )}

      <Text className="text-sm leading-5 text-ink">{item.description}</Text>

      {vm.isStudent && (
        <AppButton label={vm.done ? 'Completed · tap to undo' : 'Mark as complete'} variant={vm.done ? 'outline' : 'primary'} onPress={vm.toggleDone} />
      )}

      <SectionTitle>Materials</SectionTitle>
      {item.materials.length === 0 ? (
        <EmptyState message="No files for this item yet." />
      ) : (
        <Card className="py-1">
          {item.materials.map((file) => (
            <View key={file} className="flex-row items-center justify-between border-b border-line py-3">
              <Text className="text-sm text-ink">{file}</Text>
              <Text className="text-xs uppercase text-muted">{file.split('.').pop()}</Text>
            </View>
          ))}
        </Card>
      )}

      {lecture && vm.isStudent && (
        <>
          <SectionTitle>My bookmarks</SectionTitle>
          {vm.bookmarks.length === 0 ? (
            <EmptyState message="No bookmarks yet. Save a moment of the video to come back to it." />
          ) : (
            <Card className="py-1">
              {vm.bookmarks.map((b) => (
                <View key={b.id} className="flex-row items-center gap-3 border-b border-line py-3">
                  <Pressable accessibilityRole="button" accessibilityLabel={`Jump to ${formatTime(b.seconds)}`} onPress={() => player.seek(b.seconds)} hitSlop={8}>
                    <Text className="font-bold text-brand underline">{formatTime(b.seconds)}</Text>
                  </Pressable>
                  <Text className="flex-1 text-sm text-ink">{b.note}</Text>
                  <Pressable accessibilityRole="button" onPress={() => vm.removeBookmark(b.id)} hitSlop={8}>
                    <Text className="text-xs text-bad">Remove</Text>
                  </Pressable>
                </View>
              ))}
            </Card>
          )}

          <Card>
            <Text className="font-semibold text-ink">Add a bookmark</Text>
            <AppInput label="Time (mm:ss)" value={bookmarkForm.time} onChangeText={bookmarkForm.setTime} error={bookmarkForm.errors.time} placeholder="04:30" />
            <AppButton label={`Use current time (${bookmarkForm.currentTime})`} variant="outline" small onPress={bookmarkForm.useCurrentTime} />
            <AppInput label="Note" value={bookmarkForm.note} onChangeText={bookmarkForm.setNote} error={bookmarkForm.errors.note} placeholder="What happens at this point" />
            <AppButton label="Save bookmark" variant="outline" onPress={bookmarkForm.save} />
          </Card>
        </>
      )}
    </ScrollView>
  );
}

import { Pressable, Text, View } from 'react-native';
import { formatTime } from '@/utils/format';

const SEGMENTS = 30;

type Props = {
  title: string;
  position: number; // seconds
  duration: number; // seconds
  playing: boolean;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
};

// Player controls. In Phase 2 the video itself comes from the YouTube Data API.
export function VideoPlayer({ title, position, duration, playing, onTogglePlay, onSeek }: Props) {
  const filled = Math.round((position / duration) * SEGMENTS);

  return (
    <View className="gap-3 rounded-lg bg-ink p-4">
      <View className="h-28 justify-end">
        <Text className="text-xs font-semibold uppercase text-white/60">Lecture video</Text>
        <Text className="text-lg font-semibold text-white">{title}</Text>
      </View>

      {/* Seek bar: each segment jumps to its part of the video. */}
      <View className="h-6 flex-row items-center">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={`Seek to ${formatTime(Math.round((i / SEGMENTS) * duration))}`}
            onPress={() => onSeek(Math.round((i / SEGMENTS) * duration))}
            className="h-6 flex-1 justify-center">
            <View className={`h-1.5 ${i < filled ? 'bg-white' : 'bg-white/25'}`} />
          </Pressable>
        ))}
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-white/80">
          {formatTime(position)} / {formatTime(duration)}
        </Text>
        <View className="flex-row gap-2">
          <Pressable accessibilityRole="button" onPress={() => onSeek(position - 10)} className="rounded-md border border-white/30 px-3 py-1.5">
            <Text className="text-xs font-semibold text-white">-10s</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onTogglePlay} className="rounded-md bg-white px-4 py-1.5">
            <Text className="text-xs font-bold text-ink">{playing ? 'Pause' : position >= duration ? 'Replay' : 'Play'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => onSeek(position + 10)} className="rounded-md border border-white/30 px-3 py-1.5">
            <Text className="text-xs font-semibold text-white">+10s</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

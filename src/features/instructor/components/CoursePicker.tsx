import { ScrollView } from 'react-native';
import { Course } from '@/models/types';
import { Chip } from '@/components/ui/Chip';

type Props = { courses: Course[]; selectedId: string; onSelect: (id: string) => void };

export function CoursePicker({ courses, selectedId, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
      {courses.map((c) => (
        <Chip key={c.id} label={c.code} selected={c.id === selectedId} onPress={() => onSelect(c.id)} />
      ))}
    </ScrollView>
  );
}

import { Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { Course } from '@/models/types';
import { useSyllabusForm } from '../hooks/useCourseForms';

export function SyllabusEditor({ course, onSave }: { course: Course; onSave: (lines: string[]) => void }) {
  const { text, changeText, error, saved, save } = useSyllabusForm(course, onSave);

  return (
    <View className="gap-3">
      <AppInput label="Syllabus (one week per line)" value={text} onChangeText={changeText} error={error} multiline />
      {saved && <Text className="text-sm text-good">Syllabus saved.</Text>}
      <AppButton label="Save syllabus" variant="outline" onPress={save} />
    </View>
  );
}

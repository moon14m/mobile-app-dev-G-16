import { View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { Card } from '@/components/ui/Card';
import { Lab, Lecture } from '@/models/types';
import { useAnnouncementForm, useLabForm, useLectureForm } from '../hooks/useCourseForms';

type FormProps<T> = { initial?: T; onSave: (item: T) => void; onCancel: () => void };

function FormButtons({ onSave, onCancel, saveLabel = 'Save' }: { onSave: () => void; onCancel: () => void; saveLabel?: string }) {
  return (
    <View className="flex-row gap-2">
      <View className="flex-1">
        <AppButton label="Cancel" variant="outline" onPress={onCancel} />
      </View>
      <View className="flex-1">
        <AppButton label={saveLabel} onPress={onSave} />
      </View>
    </View>
  );
}

export function LectureForm({ initial, onSave, onCancel }: FormProps<Lecture>) {
  const { form, errors, update, save } = useLectureForm(initial, onSave);

  return (
    <Card>
      <AppInput label="Lecture title" value={form.title} onChangeText={update('title')} error={errors.title} />
      <AppInput label="Description" value={form.description} onChangeText={update('description')} error={errors.description} multiline />
      <AppInput label="Video title" value={form.videoTitle} onChangeText={update('videoTitle')} error={errors.videoTitle} />
      <AppInput label="Duration (minutes)" value={form.duration} onChangeText={update('duration')} error={errors.duration} keyboardType="number-pad" />
      <AppInput label="Material files (comma separated)" value={form.materials} onChangeText={update('materials')} placeholder="Lecture5_Slides.pdf, Notes.pdf" />
      <FormButtons onSave={save} onCancel={onCancel} />
    </Card>
  );
}

export function LabForm({ initial, onSave, onCancel }: FormProps<Lab>) {
  const { form, errors, update, save } = useLabForm(initial, onSave);

  return (
    <Card>
      <AppInput label="Lab title" value={form.title} onChangeText={update('title')} error={errors.title} />
      <AppInput label="Description" value={form.description} onChangeText={update('description')} error={errors.description} multiline />
      <AppInput label="Due date (YYYY-MM-DD)" value={form.dueDate} onChangeText={update('dueDate')} error={errors.dueDate} placeholder="2026-11-20" />
      <AppInput label="Material files (comma separated)" value={form.materials} onChangeText={update('materials')} placeholder="Lab4_Sheet.pdf" />
      <FormButtons onSave={save} onCancel={onCancel} />
    </Card>
  );
}

export function AnnouncementForm({ onPublish, onCancel }: { onPublish: (title: string, body: string) => void; onCancel: () => void }) {
  const { form, errors, update, publish } = useAnnouncementForm(onPublish);

  return (
    <Card>
      <AppInput label="Title" value={form.title} onChangeText={update('title')} error={errors.title} />
      <AppInput label="Message" value={form.body} onChangeText={update('body')} error={errors.body} multiline />
      <FormButtons onSave={publish} onCancel={onCancel} saveLabel="Publish" />
    </Card>
  );
}

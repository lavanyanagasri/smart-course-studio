
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LessonEditor } from '@/components/lesson/LessonEditor';
import { Separator } from '@/components/ui/separator';
import { LessonContent } from '@/types/lesson';

interface LessonPreviewProps {
  lessonContent: LessonContent;
  onUpdate: (updatedLesson: LessonContent) => void;
  onBack: () => void;
  onSave: () => void;
}

export const LessonPreview: React.FC<LessonPreviewProps> = ({
  lessonContent,
  onUpdate,
  onBack,
  onSave
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preview & Edit Lesson</CardTitle>
          <CardDescription>
            Review and modify the AI-generated lesson content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LessonEditor 
            lessonContent={lessonContent} 
            onUpdate={onUpdate} 
          />
          <Separator className="my-6" />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onBack}>
              Back to Input
            </Button>
            <Button 
              onClick={onSave}
              className="bg-coursegpt-purple hover:bg-coursegpt-purple-dark"
            >
              Save Lesson
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

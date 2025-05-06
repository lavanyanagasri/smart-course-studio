
import React, { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'react-router-dom';
import { LessonInputForm } from '@/components/lesson/LessonInputForm';
import { LessonPreview } from '@/components/lesson/LessonPreview';
import { useCreateLesson } from '@/hooks/useCreateLesson';

const CreateLesson = () => {
  const [searchParams] = useSearchParams();
  const initialModuleId = searchParams.get('moduleId');
  
  const {
    isGenerating,
    activeTab,
    lessonInput,
    generatedLesson,
    modules,
    setActiveTab,
    handleInputChange,
    handleModuleChange,
    handleGenerateLesson,
    handleSaveLesson,
    loadModules,
    setGeneratedLesson
  } = useCreateLesson(initialModuleId);

  useEffect(() => {
    loadModules();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create New Lesson</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="input">Lesson Input</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedLesson}>Preview & Edit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input">
            <LessonInputForm
              lessonInput={{
                title: lessonInput.title,
                topic: lessonInput.topic,
                description: lessonInput.description,
                targetAudience: lessonInput.targetAudience,
                difficultyLevel: lessonInput.difficultyLevel,
                additionalInstructions: lessonInput.additionalInstructions,
                moduleId: lessonInput.moduleId || ''
              }}
              modules={modules}
              isGenerating={isGenerating}
              handleInputChange={handleInputChange}
              handleModuleChange={handleModuleChange}
              handleGenerateLesson={handleGenerateLesson}
            />
          </TabsContent>
          
          <TabsContent value="preview">
            {generatedLesson && (
              <LessonPreview
                lessonContent={generatedLesson}
                onUpdate={setGeneratedLesson}
                onBack={() => setActiveTab('input')}
                onSave={handleSaveLesson}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CreateLesson;

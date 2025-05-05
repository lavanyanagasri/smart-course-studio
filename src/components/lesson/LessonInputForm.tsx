
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Module } from '@/types/lesson';

interface LessonInputFormProps {
  lessonInput: {
    title: string;
    topic: string;
    description: string;
    targetAudience: string;
    difficultyLevel: string;
    additionalInstructions: string;
    moduleId: string | null;
  };
  modules: Module[];
  isGenerating: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleModuleChange: (value: string) => void;
  handleGenerateLesson: () => void;
}

export const LessonInputForm: React.FC<LessonInputFormProps> = ({
  lessonInput,
  modules,
  isGenerating,
  handleInputChange,
  handleModuleChange,
  handleGenerateLesson
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lesson Details</CardTitle>
        <CardDescription>
          Provide information about your lesson to generate AI-powered content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Lesson Title</Label>
            <Input 
              id="title"
              name="title"
              placeholder="Introduction to Machine Learning" 
              value={lessonInput.title}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="topic">Main Topic</Label>
            <Input 
              id="topic"
              name="topic" 
              placeholder="Machine Learning Fundamentals" 
              value={lessonInput.topic}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Brief Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="A basic introduction to key machine learning concepts for beginners..."
            rows={3}
            value={lessonInput.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input 
              id="targetAudience"
              name="targetAudience" 
              placeholder="Undergraduate students, Beginners" 
              value={lessonInput.targetAudience}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficultyLevel">Difficulty Level</Label>
            <Input 
              id="difficultyLevel"
              name="difficultyLevel" 
              placeholder="Beginner, Intermediate, Advanced" 
              value={lessonInput.difficultyLevel}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="moduleSelect">Module (Optional)</Label>
            <Select 
              value={lessonInput.moduleId || ''} 
              onValueChange={handleModuleChange}
            >
              <SelectTrigger id="moduleSelect">
                <SelectValue placeholder="Select a module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalInstructions">Additional Instructions (Optional)</Label>
          <Textarea
            id="additionalInstructions"
            name="additionalInstructions"
            placeholder="Include specific topics, pedagogical approaches, or content preferences..."
            rows={3}
            value={lessonInput.additionalInstructions}
            onChange={handleInputChange}
          />
        </div>

        <div className="pt-4">
          <Button 
            onClick={handleGenerateLesson} 
            className="w-full bg-coursegpt-purple hover:bg-coursegpt-purple-dark"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Lesson"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

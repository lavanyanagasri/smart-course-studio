
import React, { useState } from 'react';
import { LessonContent } from '@/types/lesson';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface LessonEditorProps {
  lessonContent: LessonContent;
  onUpdate: (updatedLesson: LessonContent) => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({ lessonContent, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleInputChange = (
    section: keyof LessonContent, 
    value: string | string[] | any[],
    index?: number | string,
    field?: string,
    nestedField?: string
  ) => {
    const updatedLesson = { ...lessonContent };
    
    if (typeof index === 'number' && field) {
      // Update nested field in array
      if (section === 'keyConcepts' && (field === 'term' || field === 'definition')) {
        updatedLesson.keyConcepts[index][field] = value as string;
      } else if (section === 'learningOutcomes') {
        updatedLesson.learningOutcomes[index] = value as string;
      } else if (section === 'content' && field === 'sections') {
        if (nestedField && (nestedField === 'title' || nestedField === 'content')) {
          updatedLesson.content.sections[index][nestedField] = value as string;
        }
      } else if (section === 'activities') {
        if (field === 'type' && typeof value === 'string') {
          // Ensure value is a valid activity type
          const activityTypes = ['discussion', 'exercise', 'quiz', 'project'] as const;
          const activityType = activityTypes.includes(value as any) 
            ? value as 'discussion' | 'exercise' | 'quiz' | 'project'
            : 'exercise';
          updatedLesson.activities[index].type = activityType;
        } else if (field === 'title' || field === 'description') {
          updatedLesson.activities[index][field] = value as string;
        }
      }
    } else if (section === 'title' || section === 'description') {
      // Update top-level string fields
      updatedLesson[section] = value as string;
    } else if (section === 'content' && typeof index === 'string') {
      // Update content sections like introduction, conclusion
      updatedLesson.content[index as 'introduction' | 'conclusion'] = value as string;
    }
    
    onUpdate(updatedLesson);
  };

  const addItem = (section: 'learningOutcomes' | 'keyConcepts' | 'content.sections' | 'activities') => {
    const updatedLesson = { ...lessonContent };
    
    if (section === 'learningOutcomes') {
      updatedLesson.learningOutcomes.push('New learning outcome');
    } else if (section === 'keyConcepts') {
      updatedLesson.keyConcepts.push({ term: 'New Term', definition: 'Definition here' });
    } else if (section === 'content.sections') {
      updatedLesson.content.sections.push({ title: 'New Section', content: 'Content here' });
    } else if (section === 'activities') {
      updatedLesson.activities.push({ 
        title: 'New Activity', 
        description: 'Activity description', 
        type: 'exercise' 
      });
    }
    
    onUpdate(updatedLesson);
  };

  const removeItem = (section: 'learningOutcomes' | 'keyConcepts' | 'content.sections' | 'activities', index: number) => {
    const updatedLesson = { ...lessonContent };
    
    if (section === 'learningOutcomes') {
      updatedLesson.learningOutcomes.splice(index, 1);
    } else if (section === 'keyConcepts') {
      updatedLesson.keyConcepts.splice(index, 1);
    } else if (section === 'content.sections') {
      updatedLesson.content.sections.splice(index, 1);
    } else if (section === 'activities') {
      updatedLesson.activities.splice(index, 1);
    }
    
    onUpdate(updatedLesson);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="lessonTitle">Lesson Title</Label>
          <Input
            id="lessonTitle"
            value={lessonContent.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="text-xl font-semibold"
          />
        </div>
        <div>
          <Label htmlFor="lessonDescription">Description</Label>
          <Textarea
            id="lessonDescription"
            value={lessonContent.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Learning Outcomes</h3>
                <p className="text-sm text-gray-500">What students will learn from this lesson</p>
                
                {lessonContent.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Textarea
                      value={outcome}
                      onChange={(e) => handleInputChange('learningOutcomes', e.target.value, index)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem('learningOutcomes', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => addItem('learningOutcomes')}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Outcome
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Key Concepts</h3>
                <p className="text-sm text-gray-500">Important terminology and concepts covered</p>
                
                {lessonContent.keyConcepts.map((concept, index) => (
                  <div key={index} className="space-y-2 border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`term-${index}`}>Term</Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem('keyConcepts', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      id={`term-${index}`}
                      value={concept.term}
                      onChange={(e) => handleInputChange('keyConcepts', e.target.value, index, 'term')}
                    />
                    <Label htmlFor={`definition-${index}`}>Definition</Label>
                    <Textarea
                      id={`definition-${index}`}
                      value={concept.definition}
                      onChange={(e) => handleInputChange('keyConcepts', e.target.value, index, 'definition')}
                      rows={2}
                    />
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => addItem('keyConcepts')}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Concept
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Introduction</h3>
                <Textarea
                  value={lessonContent.content.introduction}
                  onChange={(e) => handleInputChange('content', e.target.value, 'introduction')}
                  rows={4}
                />
                
                <h3 className="text-lg font-medium mt-6">Main Content Sections</h3>
                {lessonContent.content.sections.map((section, index) => (
                  <div key={index} className="space-y-2 border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`section-title-${index}`}>Section Title</Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem('content.sections', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      id={`section-title-${index}`}
                      value={section.title}
                      onChange={(e) => handleInputChange('content', e.target.value, index, 'sections', 'title')}
                    />
                    <Label htmlFor={`section-content-${index}`}>Content</Label>
                    <Textarea
                      id={`section-content-${index}`}
                      value={section.content}
                      onChange={(e) => handleInputChange('content', e.target.value, index, 'sections', 'content')}
                      rows={4}
                    />
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => addItem('content.sections')}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Section
                </Button>
                
                <h3 className="text-lg font-medium mt-6">Conclusion</h3>
                <Textarea
                  value={lessonContent.content.conclusion}
                  onChange={(e) => handleInputChange('content', e.target.value, 'conclusion')}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Learning Activities</h3>
                <p className="text-sm text-gray-500">Interactive exercises and assignments</p>
                
                {lessonContent.activities.map((activity, index) => (
                  <div key={index} className="space-y-2 border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`activity-title-${index}`}>Activity Title</Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem('activities', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      id={`activity-title-${index}`}
                      value={activity.title}
                      onChange={(e) => handleInputChange('activities', e.target.value, index, 'title')}
                    />
                    <div className="flex gap-4 items-center">
                      <Label htmlFor={`activity-type-${index}`} className="whitespace-nowrap">Type:</Label>
                      <select 
                        id={`activity-type-${index}`}
                        value={activity.type}
                        onChange={(e) => handleInputChange('activities', e.target.value, index, 'type')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="discussion">Discussion</option>
                        <option value="exercise">Exercise</option>
                        <option value="quiz">Quiz</option>
                        <option value="project">Project</option>
                      </select>
                    </div>
                    <Label htmlFor={`activity-desc-${index}`}>Description</Label>
                    <Textarea
                      id={`activity-desc-${index}`}
                      value={activity.description}
                      onChange={(e) => handleInputChange('activities', e.target.value, index, 'description')}
                      rows={3}
                    />
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => addItem('activities')}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Assessment Questions</h3>
              
              {lessonContent.assessment.questions.map((question, index) => (
                <div key={index} className="space-y-2 mb-6 border-b pb-4 last:border-0">
                  <Label htmlFor={`question-${index}`}>Question {index + 1}</Label>
                  <Textarea
                    id={`question-${index}`}
                    value={question.question}
                    rows={2}
                    readOnly
                  />
                  
                  {question.options && (
                    <div className="mt-2 space-y-2">
                      <Label>Options</Label>
                      <div className="pl-4 space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <Input
                              type="radio"
                              checked={question.answer === option}
                              readOnly
                              className="h-4 w-4"
                            />
                            <span className="text-sm">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <p className="text-sm text-gray-500 mt-4">
                Note: Assessment editing is limited in this preview. Full version allows creating, editing, and deleting questions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Additional Resources</h3>
              
              {lessonContent.resources.map((resource, index) => (
                <div key={index} className="mb-4 pb-4 border-b last:border-0">
                  <h4 className="font-medium">{resource.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                  {resource.url && (
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-coursegpt-purple hover:underline mt-1 block"
                    >
                      {resource.url}
                    </a>
                  )}
                </div>
              ))}
              
              <p className="text-sm text-gray-500 mt-4">
                Note: Resource editing is limited in this preview. Full version allows adding, editing, and removing resources.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

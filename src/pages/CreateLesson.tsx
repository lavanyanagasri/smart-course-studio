
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { LessonEditor } from '@/components/lesson/LessonEditor';
import { LessonContent, Module } from '@/types/lesson';
import { generateLesson } from '@/lib/ai-service';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CreateLesson = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialModuleId = searchParams.get('moduleId');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [lessonInput, setLessonInput] = useState({
    title: '',
    topic: '',
    description: '',
    targetAudience: '',
    difficultyLevel: '',
    additionalInstructions: '',
    moduleId: initialModuleId || ''
  });
  const [generatedLesson, setGeneratedLesson] = useState<LessonContent | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    // In a real app, fetch modules from API or state management
    // For now we'll use mock data
    setModules([
      {
        id: '1',
        title: 'AI Basics',
        description: 'Fundamental concepts of artificial intelligence and machine learning.',
        lessons: ['lesson1', 'lesson2', 'lesson3'],
        order: 1,
      },
      {
        id: '2',
        title: 'Advanced AI',
        description: 'Deep learning, neural networks, and advanced AI topics.',
        lessons: ['lesson4', 'lesson5'],
        order: 2,
      }
    ]);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLessonInput({
      ...lessonInput,
      [name]: value
    });
  };

  const handleModuleChange = (value: string) => {
    setLessonInput({
      ...lessonInput,
      moduleId: value
    });
  };

  const handleGenerateLesson = async () => {
    if (!lessonInput.topic || !lessonInput.title) {
      toast({
        title: "Missing information",
        description: "Please provide at least a title and topic for your lesson.",
        variant: "destructive"
      });
      return;
    }

    // Check if OpenAI API key exists in localStorage if not using environment variable
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        toast({
          title: "API Key Required",
          description: "Please add your OpenAI API key in the settings page.",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      setIsGenerating(true);
      const lesson = await generateLesson(lessonInput);
      setGeneratedLesson(lesson);
      setActiveTab('preview');
      
      toast({
        title: "Lesson generated",
        description: "Your lesson has been created successfully!",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your lesson. Please try again.",
        variant: "destructive"
      });
      console.error("Error generating lesson:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveLesson = () => {
    if (generatedLesson) {
      // In a real app, save to database or localStorage with the module association
      toast({
        title: "Lesson saved",
        description: `Your lesson has been saved successfully${lessonInput.moduleId ? ' to the selected module' : ''}!`,
      });
      
      // Redirect based on whether a module was selected
      if (lessonInput.moduleId) {
        navigate(`/modules/${lessonInput.moduleId}/lessons`);
      } else {
        navigate('/lessons');
      }
    }
  };

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
                      value={lessonInput.moduleId} 
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
          </TabsContent>
          
          <TabsContent value="preview">
            {generatedLesson && (
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
                      lessonContent={generatedLesson} 
                      onUpdate={(updatedLesson) => setGeneratedLesson(updatedLesson)} 
                    />
                    <Separator className="my-6" />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setActiveTab('input')}>
                        Back to Input
                      </Button>
                      <Button 
                        onClick={handleSaveLesson}
                        className="bg-coursegpt-purple hover:bg-coursegpt-purple-dark"
                      >
                        Save Lesson
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CreateLesson;

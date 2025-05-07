
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { generateLesson } from '@/lib/ai-service';
import { LessonContent, Module, LessonInput } from '@/types/lesson';

export function useCreateLesson(initialModuleId: string | null) {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [lessonInput, setLessonInput] = useState<LessonInput>({
    title: '',
    topic: '',
    description: '',
    targetAudience: '',
    difficultyLevel: '',
    additionalInstructions: '',
    moduleId: initialModuleId || null
  });
  const [generatedLesson, setGeneratedLesson] = useState<LessonContent | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

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
      moduleId: value === '' ? null : value
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

    try {
      setIsGenerating(true);
      // Add a timestamp to ensure unique prompts for different topics
      const lesson = await generateLesson({
        ...lessonInput,
        timestamp: new Date().toISOString() // Add timestamp to make each request unique
      });
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
    if (!generatedLesson) {
      toast({
        title: "No lesson to save",
        description: "Please generate a lesson first.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Always fetch the most current modules data before saving
      const existingModulesString = localStorage.getItem('modules');
      const currentModules = existingModulesString ? JSON.parse(existingModulesString) : [];
      
      // Get selected module name if applicable
      let selectedModuleName = null;
      if (lessonInput.moduleId) {
        const selectedModule = currentModules.find((module: Module) => module.id === lessonInput.moduleId);
        selectedModuleName = selectedModule ? selectedModule.title : null;
      }
      
      // Create lesson object to save
      const lessonToSave = {
        id: crypto.randomUUID(),
        title: generatedLesson.title,
        topic: lessonInput.topic,
        date: new Date().toISOString(),
        moduleId: lessonInput.moduleId,
        moduleName: selectedModuleName,
        content: generatedLesson
      };
      
      // Get existing lessons or initialize empty array
      const existingLessonsString = localStorage.getItem('lessons');
      const existingLessons = existingLessonsString ? JSON.parse(existingLessonsString) : [];
      
      // Add new lesson to array
      const updatedLessons = [...existingLessons, lessonToSave];
      
      // Save back to localStorage
      localStorage.setItem('lessons', JSON.stringify(updatedLessons));
      
      // Update module if lesson is assigned to a module
      if (lessonInput.moduleId) {
        const updatedModules = currentModules.map((module: Module) => {
          if (module.id === lessonInput.moduleId) {
            // Make sure lessons array exists before adding to it
            const currentLessons = module.lessons || [];
            return {
              ...module,
              lessons: [...currentLessons, lessonToSave.id]
            };
          }
          return module;
        });
        
        localStorage.setItem('modules', JSON.stringify(updatedModules));
      }
      
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
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving your lesson. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadModules = () => {
    try {
      const savedModulesString = localStorage.getItem('modules');
      if (savedModulesString) {
        const savedModules = JSON.parse(savedModulesString);
        setModules(savedModules);
      }
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  };

  return {
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
  };
}

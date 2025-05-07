import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Edit, File, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const ModuleLessons = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [module, setModule] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  
  useEffect(() => {
    // Load module and lessons from localStorage
    if (moduleId) {
      loadModuleData(moduleId);
    }
  }, [moduleId]);
  
  const loadModuleData = (moduleId: string) => {
    try {
      // Load module data
      const modulesString = localStorage.getItem('modules');
      if (modulesString) {
        const modules = JSON.parse(modulesString);
        const foundModule = modules.find((m: any) => m.id === moduleId);
        if (foundModule) {
          setModule(foundModule);
          
          // Load lessons that belong to this module
          const lessonsString = localStorage.getItem('lessons');
          if (lessonsString) {
            const allLessons = JSON.parse(lessonsString);
            const moduleLessons = allLessons.filter((lesson: any) => 
              lesson.moduleId === moduleId
            );
            setLessons(moduleLessons);
          }
        }
      }
    } catch (error) {
      console.error('Error loading module data:', error);
      toast({
        title: "Error",
        description: "Failed to load module data",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLesson = (lessonId: string) => {
    try {
      // Remove lesson from lessons array
      const lessonsString = localStorage.getItem('lessons');
      if (lessonsString) {
        const allLessons = JSON.parse(lessonsString);
        const updatedLessons = allLessons.filter((lesson: any) => lesson.id !== lessonId);
        localStorage.setItem('lessons', JSON.stringify(updatedLessons));
      }
      
      // Remove lesson reference from module
      const modulesString = localStorage.getItem('modules');
      if (modulesString && moduleId) {
        const modules = JSON.parse(modulesString);
        const updatedModules = modules.map((m: any) => {
          if (m.id === moduleId) {
            return {
              ...m,
              lessons: (m.lessons || []).filter((id: string) => id !== lessonId)
            };
          }
          return m;
        });
        localStorage.setItem('modules', JSON.stringify(updatedModules));
      }
      
      // Update state
      setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
      
      toast({
        title: "Lesson deleted",
        description: "The lesson has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        title: "Error",
        description: "Failed to delete lesson",
        variant: "destructive"
      });
    }
  };

  const handleCreateLessonForModule = () => {
    if (moduleId) {
      navigate(`/create-lesson?moduleId=${moduleId}`);
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <Link to="/modules" className="text-coursegpt-purple hover:underline inline-flex items-center mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Modules
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">{module?.title || "Module"}</h1>
              <p className="text-gray-400 mt-1">{module?.description}</p>
            </div>
            <Button 
              className="bg-coursegpt-purple hover:bg-coursegpt-purple-dark"
              onClick={handleCreateLessonForModule}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Lesson
            </Button>
          </div>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <File className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-100 mb-2">No lessons yet</h3>
            <p className="text-gray-400 mb-6">Create your first lesson for this module</p>
            <Button 
              className="bg-coursegpt-purple hover:bg-coursegpt-purple-dark"
              onClick={handleCreateLessonForModule}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Lesson
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="bg-secondary border-gray-800">
                <CardHeader>
                  <CardTitle>{lesson.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{lesson.topic}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-300"
                      onClick={() => navigate(`/edit-lesson/${lesson.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-400">
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the lesson and cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm" 
                    className="text-coursegpt-purple hover:bg-coursegpt-gray-light"
                  >
                    View Lesson
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ModuleLessons;

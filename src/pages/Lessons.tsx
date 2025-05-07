
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, FolderPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LessonContent } from '@/types/lesson';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SavedLesson {
  id: string;
  title: string;
  topic: string;
  date: string;
  moduleId: string | null;
  moduleName: string | null;
  content: LessonContent;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons?: string[];
  order: number;
}

const Lessons = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lessons, setLessons] = useState<SavedLesson[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  const [selectedLessonForModule, setSelectedLessonForModule] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  
  useEffect(() => {
    // Load lessons from localStorage
    const loadLessons = () => {
      try {
        const savedLessonsString = localStorage.getItem('lessons');
        if (savedLessonsString) {
          const savedLessons = JSON.parse(savedLessonsString);
          setLessons(savedLessons);
        }
      } catch (error) {
        console.error('Error loading lessons:', error);
        toast({
          title: "Error Loading Lessons",
          description: "There was a problem loading your lessons.",
          variant: "destructive"
        });
      }
    };

    // Load modules from localStorage
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

    loadLessons();
    loadModules();
  }, [toast]);

  const handleEditLesson = (lessonId: string) => {
    navigate(`/edit-lesson/${lessonId}`);
  };

  const handleDeleteConfirm = () => {
    if (!lessonToDelete) return;
    
    try {
      // Filter out the lesson to delete
      const updatedLessons = lessons.filter(lesson => lesson.id !== lessonToDelete);
      
      // Save updated lessons to localStorage
      localStorage.setItem('lessons', JSON.stringify(updatedLessons));
      
      // Update state
      setLessons(updatedLessons);
      
      toast({
        title: "Lesson Deleted",
        description: "The lesson has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        title: "Delete Failed",
        description: "There was a problem deleting the lesson.",
        variant: "destructive"
      });
    }
    
    // Close the dialog
    setIsDeleteDialogOpen(false);
    setLessonToDelete(null);
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessonToDelete(lessonId);
    setIsDeleteDialogOpen(true);
  };

  const handleAddToModule = (lessonId: string) => {
    setSelectedLessonForModule(lessonId);
    setIsModuleDialogOpen(true);
  };

  const handleAddToModuleConfirm = () => {
    if (!selectedLessonForModule || !selectedModuleId) return;

    try {
      // Update the lesson with module information
      const updatedLessons = lessons.map(lesson => {
        if (lesson.id === selectedLessonForModule) {
          const selectedModule = modules.find(m => m.id === selectedModuleId);
          return {
            ...lesson,
            moduleId: selectedModuleId,
            moduleName: selectedModule?.title || "Unknown Module"
          };
        }
        return lesson;
      });

      // Update modules to include lesson reference
      const updatedModules = modules.map(module => {
        if (module.id === selectedModuleId) {
          const moduleWithLesson = {
            ...module,
            lessons: [...(module.lessons || []), selectedLessonForModule]
          };
          return moduleWithLesson;
        }
        return module;
      });

      // Save updated data to localStorage
      localStorage.setItem('lessons', JSON.stringify(updatedLessons));
      localStorage.setItem('modules', JSON.stringify(updatedModules));
      
      // Update state
      setLessons(updatedLessons);
      setModules(updatedModules);
      
      toast({
        title: "Lesson Added to Module",
        description: "The lesson has been successfully added to the selected module.",
      });

      // Reset and close dialog
      setSelectedLessonForModule(null);
      setSelectedModuleId("");
      setIsModuleDialogOpen(false);
    } catch (error) {
      console.error('Error adding lesson to module:', error);
      toast({
        title: "Operation Failed",
        description: "There was a problem adding the lesson to the module.",
        variant: "destructive"
      });
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Your Lessons</h1>
            <p className="text-gray-400 mt-1">Manage and organize your created lessons</p>
          </div>
          <Button 
            className="bg-white text-black hover:bg-gray-200"
            onClick={() => navigate('/create-lesson')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Lesson
          </Button>
        </div>

        {lessons.length === 0 ? (
          <div className="bg-secondary p-8 rounded-lg border border-gray-800 text-center">
            <h3 className="text-lg font-medium mb-2 text-gray-100">No lessons yet</h3>
            <p className="text-gray-400 mb-4">Start by creating your first lesson.</p>
            <Button 
              onClick={() => navigate('/create-lesson')}
              className="bg-white text-black hover:bg-gray-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Lesson
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="bg-secondary border-gray-800 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-gray-100">{lesson.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-400">Topic:</span>
                      <p className="text-gray-300">{lesson.topic}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400">Module:</span>
                      <p className="text-gray-300">{lesson.moduleName || 'No module assigned'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400">Created:</span>
                      <p className="text-gray-300">{new Date(lesson.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-800 pt-4 bg-black/20">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="text-gray-300" onClick={() => handleEditLesson(lesson.id)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-300" onClick={() => handleAddToModule(lesson.id)}>
                      <FolderPlus className="h-4 w-4 mr-1" /> Add to Module
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-400" onClick={() => handleDeleteLesson(lesson.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-secondary border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-100">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the selected lesson.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-gray-100 hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add to Module Dialog */}
      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent className="bg-secondary border-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>Add Lesson to Module</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select a module to add this lesson to.
            </DialogDescription>
          </DialogHeader>
          
          {modules.length > 0 ? (
            <>
              <div className="py-4">
                <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-gray-800">
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModuleDialogOpen(false)} 
                  className="border-gray-700 text-gray-200 hover:bg-gray-800">
                  Cancel
                </Button>
                <Button onClick={handleAddToModuleConfirm} disabled={!selectedModuleId}
                  className="bg-white text-black hover:bg-gray-200">
                  Add to Module
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="py-4 text-center">
                <p className="text-gray-400">No modules available. Create a module first.</p>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModuleDialogOpen(false)}
                  className="border-gray-700 text-gray-200 hover:bg-gray-800">
                  Cancel
                </Button>
                <Button onClick={() => {
                  setIsModuleDialogOpen(false);
                  navigate('/modules');
                }} className="bg-white text-black hover:bg-gray-200">
                  Create Module
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Lessons;


import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
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

interface SavedLesson {
  id: string;
  title: string;
  topic: string;
  date: string;
  moduleId: string | null;
  moduleName: string | null;
  content: LessonContent;
}

const Lessons = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lessons, setLessons] = useState<SavedLesson[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  
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

    loadLessons();
  }, [toast]);

  const handleEditLesson = (lessonId: string) => {
    // For now, we'll just navigate to the edit page
    // In a full implementation, we would pass the lesson ID or load it in the edit page
    navigate(`/edit-lesson/${lessonId}`);
    
    // Temporary toast since edit functionality isn't fully implemented
    toast({
      title: "Edit Feature",
      description: "Edit functionality will be implemented in a future update.",
    });
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

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Lessons</h1>
            <p className="text-gray-600 mt-1">Manage and organize your created lessons</p>
          </div>
          <Button 
            className="bg-coursegpt-purple hover:bg-coursegpt-purple-dark"
            onClick={() => navigate('/create-lesson')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Lesson
          </Button>
        </div>

        {lessons.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
            <h3 className="text-lg font-medium mb-2">No lessons yet</h3>
            <p className="text-gray-500 mb-4">Start by creating your first lesson.</p>
            <Button 
              onClick={() => navigate('/create-lesson')}
              className="bg-coursegpt-purple hover:bg-coursegpt-purple-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Lesson
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="overflow-hidden">
                <CardHeader className="bg-coursegpt-gray-light pb-2">
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Topic:</span>
                      <p className="text-gray-800">{lesson.topic}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Module:</span>
                      <p className="text-gray-800">{lesson.moduleName || 'No module assigned'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Created:</span>
                      <p className="text-gray-800">{new Date(lesson.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-gray-50 pt-4">
                  <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => handleEditLesson(lesson.id)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteLesson(lesson.id)}>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected lesson.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Lessons;

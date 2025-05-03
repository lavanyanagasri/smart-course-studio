
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Edit, File, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const ModuleLessons = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { toast } = useToast();
  
  // In a real app, these would be fetched from an API based on the moduleId
  const [module] = useState({
    id: moduleId,
    title: moduleId === '1' ? 'AI Basics' : 'Advanced AI',
    description: moduleId === '1' 
      ? 'Fundamental concepts of artificial intelligence and machine learning.'
      : 'Deep learning, neural networks, and advanced AI topics.',
  });
  
  const [lessons] = useState([
    {
      id: 'lesson1',
      title: 'Introduction to AI',
      description: 'Overview of artificial intelligence and its history',
      moduleId: '1'
    },
    {
      id: 'lesson2',
      title: 'Machine Learning Fundamentals',
      description: 'Basic concepts and approaches in machine learning',
      moduleId: '1'
    },
    {
      id: 'lesson3',
      title: 'Neural Networks Overview',
      description: 'Introduction to neural network architecture',
      moduleId: '1'
    },
    {
      id: 'lesson4',
      title: 'Deep Learning Architectures',
      description: 'Advanced neural network structures and applications',
      moduleId: '2'
    },
    {
      id: 'lesson5',
      title: 'Reinforcement Learning',
      description: 'Learning through interaction with an environment',
      moduleId: '2'
    },
  ].filter(lesson => lesson.moduleId === moduleId));

  const handleDeleteLesson = (lessonId: string) => {
    toast({
      title: "Lesson deleted",
      description: "The lesson has been deleted successfully.",
    });
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
              <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
              <p className="text-gray-600 mt-1">{module.description}</p>
            </div>
            <Button 
              className="bg-coursegpt-purple hover:bg-coursegpt-purple-dark"
              onClick={() => {
                // In a real app, this would redirect to the create lesson page with moduleId pre-filled
                toast({
                  title: "Create Lesson",
                  description: "Navigating to lesson creation...",
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Lesson
            </Button>
          </div>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <File className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
            <p className="text-gray-600 mb-6">Create your first lesson for this module</p>
            <Button 
              className="bg-coursegpt-purple hover:bg-coursegpt-purple-dark"
              onClick={() => {
                // In a real app, this would redirect to the create lesson page
                toast({
                  title: "Create Lesson",
                  description: "Navigating to lesson creation...",
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Lesson
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardHeader>
                  <CardTitle>{lesson.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{lesson.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600">
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

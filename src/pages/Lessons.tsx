
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Lessons = () => {
  const navigate = useNavigate();
  
  // This would be fetched from an API or local storage in a real app
  const lessons = [
    {
      id: '1',
      title: 'Introduction to Machine Learning',
      topic: 'Machine Learning Fundamentals',
      date: '2023-05-01',
      module: 'AI Basics'
    },
    {
      id: '2',
      title: 'Neural Network Architecture',
      topic: 'Deep Learning',
      date: '2023-05-03',
      module: 'Advanced AI'
    }
  ];

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
                      <p className="text-gray-800">{lesson.module}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Created:</span>
                      <p className="text-gray-800">{new Date(lesson.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-gray-50 pt-4">
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
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

export default Lessons;

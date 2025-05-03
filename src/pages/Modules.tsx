
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, ArrowRight } from 'lucide-react';

const Modules = () => {
  // This would be fetched from an API or local storage in a real app
  const modules = [
    {
      id: '1',
      title: 'AI Basics',
      lessonCount: 3,
      description: 'Fundamental concepts of artificial intelligence and machine learning.',
    },
    {
      id: '2',
      title: 'Advanced AI',
      lessonCount: 2,
      description: 'Deep learning, neural networks, and advanced AI topics.',
    }
  ];

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Modules</h1>
            <p className="text-gray-600 mt-1">Organize lessons into coherent modules</p>
          </div>
          <Button className="bg-coursegpt-purple hover:bg-coursegpt-purple-dark">
            <Plus className="h-4 w-4 mr-2" />
            Create Module
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card key={module.id}>
              <CardHeader className="bg-coursegpt-gray-light pb-2">
                <CardTitle>{module.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600 mb-4">{module.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">{module.lessonCount}</span>
                  <span className="ml-1">{module.lessonCount === 1 ? 'Lesson' : 'Lessons'}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-gray-50 pt-4">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="outline"
                  size="sm" 
                  className="text-coursegpt-purple hover:bg-coursegpt-gray-light"
                >
                  View Lessons <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}

          <Card className="border-dashed border-2 flex items-center justify-center h-[232px]">
            <Button variant="ghost" className="flex flex-col h-full w-full py-8">
              <Plus className="h-12 w-12 mb-2 text-gray-400" />
              <span className="text-gray-500">Add New Module</span>
            </Button>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Modules;

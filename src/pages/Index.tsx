
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ListOrdered, Plus } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to CourseGPT</h1>
            <p className="text-gray-600 mt-1">Create and organize your course content with AI assistance</p>
          </div>
          <Button 
            className="bg-coursegpt-purple hover:bg-coursegpt-purple-dark"
            onClick={() => navigate('/create-lesson')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Lesson
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-coursegpt-purple" />
                Lesson Generator
              </CardTitle>
              <CardDescription>
                Create structured lessons with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Generate complete lessons including titles, learning outcomes, key concepts, and activities in minutes.</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/create-lesson')}
              >
                Create New Lesson
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ListOrdered className="h-5 w-5 mr-2 text-coursegpt-purple" />
                Module Organization
              </CardTitle>
              <CardDescription>
                Organize lessons into coherent modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Group related lessons, sequence content logically, and manage your course structure.</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/modules')}
              >
                Organize Modules
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Lessons</h2>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-center text-gray-500">No lessons created yet. Start by creating your first lesson!</p>
            <div className="mt-4 flex justify-center">
              <Button 
                onClick={() => navigate('/create-lesson')}
                className="bg-coursegpt-purple hover:bg-coursegpt-purple-dark"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Lesson
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;


import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, ArrowRight } from 'lucide-react';
import { ModuleForm } from '@/components/module/ModuleForm';
import { Module } from '@/types/lesson';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';

const Modules = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  // This would be fetched from an API or local storage in a real app
  const [modules, setModules] = useState<Module[]>([
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

  const handleCreateModule = () => {
    setEditingModule(null);
    setShowForm(true);
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setShowForm(true);
  };

  const handleSaveModule = (module: Module) => {
    if (editingModule) {
      // Update existing module
      setModules(prev => 
        prev.map(m => m.id === module.id ? module : m)
      );
      toast({
        title: "Module updated",
        description: `Module "${module.title}" has been updated successfully.`,
      });
    } else {
      // Add new module
      setModules(prev => [...prev, { ...module, order: prev.length + 1 }]);
      toast({
        title: "Module created",
        description: `Module "${module.title}" has been created successfully.`,
      });
    }
    setShowForm(false);
    setEditingModule(null);
  };

  const handleDeleteModule = (id: string) => {
    setModules(prev => prev.filter(module => module.id !== id));
    toast({
      title: "Module deleted",
      description: "The module has been deleted successfully.",
    });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingModule(null);
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Modules</h1>
            <p className="text-gray-600 mt-1">Organize lessons into coherent modules</p>
          </div>
          <Button 
            className="bg-coursegpt-purple hover:bg-coursegpt-purple-dark"
            onClick={handleCreateModule}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Module
          </Button>
        </div>

        {showForm ? (
          <ModuleForm
            initialData={editingModule || undefined}
            onSave={handleSaveModule}
            onCancel={handleCancelForm}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card key={module.id}>
                <CardHeader className="bg-coursegpt-gray-light pb-2">
                  <CardTitle>{module.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600 mb-4">{module.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">{module.lessons.length}</span>
                    <span className="ml-1">{module.lessons.length === 1 ? 'Lesson' : 'Lessons'}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-gray-50 pt-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600"
                      onClick={() => handleEditModule(module)}
                    >
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
                            This will permanently delete the module and cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteModule(module.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <Link to={`/modules/${module.id}/lessons`}>
                    <Button 
                      variant="outline"
                      size="sm" 
                      className="text-coursegpt-purple hover:bg-coursegpt-gray-light"
                    >
                      View Lessons <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}

            <Card className="border-dashed border-2 flex items-center justify-center h-[232px]">
              <Button 
                variant="ghost" 
                className="flex flex-col h-full w-full py-8"
                onClick={handleCreateModule}
              >
                <Plus className="h-12 w-12 mb-2 text-gray-400" />
                <span className="text-gray-500">Add New Module</span>
              </Button>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Modules;

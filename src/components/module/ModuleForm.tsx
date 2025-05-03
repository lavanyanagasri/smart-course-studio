
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Module } from '@/types/lesson';
import { useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ModuleFormProps {
  initialData?: Module;
  onSave: (module: Module) => void;
  onCancel: () => void;
}

export const ModuleForm: React.FC<ModuleFormProps> = ({ 
  initialData, 
  onSave, 
  onCancel 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Module>(
    initialData || {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      lessons: [],
      order: 0,
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Module title is required",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{initialData ? 'Edit Module' : 'Create Module'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Module Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter module title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter module description"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-coursegpt-purple hover:bg-coursegpt-purple-dark"
          >
            {initialData ? 'Update Module' : 'Create Module'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

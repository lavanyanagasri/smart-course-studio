
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-800">Course Creator Studio</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/create-lesson')}
          >
            <Plus className="h-4 w-4 mr-2" /> New Lesson
          </Button>
        </div>
      </div>
    </header>
  );
};

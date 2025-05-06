
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Book, 
  BookOpen, 
  ListOrdered,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <h1 className="font-bold text-xl text-coursegpt-purple">CourseGPT</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Book /> : <BookOpen />}
        </Button>
      </div>

      <div className="p-4">
        <Button asChild variant="default" className="w-full mb-4 bg-coursegpt-purple hover:bg-coursegpt-purple-dark">
          <Link to="/create-lesson">
            <Plus className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
            {!collapsed && "New Lesson"}
          </Link>
        </Button>
      </div>

      <nav className="flex-1 overflow-auto">
        <ul className="space-y-1 p-2">
          <NavItem icon={<BookOpen />} label="Lessons" to="/lessons" collapsed={collapsed} />
          <NavItem icon={<ListOrdered />} label="Modules" to="/modules" collapsed={collapsed} />
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="text-xs text-gray-500">
            CourseGPT v1.0.0
          </div>
        )}
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, collapsed }) => {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md transition-colors"
      >
        <span className="text-coursegpt-purple">{icon}</span>
        {!collapsed && <span>{label}</span>}
      </Link>
    </li>
  );
};

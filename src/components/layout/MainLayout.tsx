
import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  );
};

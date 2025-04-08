
import React from 'react';
import { DashboardSidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';

type DashboardLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className={cn("flex-1 overflow-auto", className)}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

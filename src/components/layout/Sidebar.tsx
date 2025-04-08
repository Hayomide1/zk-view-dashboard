
import React from 'react';
import { Home, BarChart3, Zap, History, LayoutDashboard, Settings, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type SidebarLinkProps = {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  href: string;
};

const SidebarLink = ({ icon: Icon, label, isActive, href }: SidebarLinkProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80"
      )}>
        <a href={href}>
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const DashboardSidebar = () => {
  const pathname = "/"; // In a real app, use react-router to determine current path
  const isMobile = useIsMobile();
  
  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="py-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-pink-300" />
          <span className="font-bold text-lg">ZK View</span>
        </div>
        {isMobile && (
          <SidebarTrigger>
            {/* Fix: Use proper ReactNode pattern instead of function */}
            <Menu className="h-5 w-5 md:hidden" data-hide-when-open />
            <X className="h-5 w-5 md:hidden" data-show-when-open />
          </SidebarTrigger>
        )}
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu className="space-y-1 py-2">
          <SidebarLink
            href="/"
            icon={LayoutDashboard}
            label="Dashboard"
            isActive={pathname === '/'}
          />
          <SidebarLink 
            href="/networks" 
            icon={BarChart3} 
            label="Networks" 
            isActive={pathname.includes('/networks')}
          />
          <SidebarLink 
            href="/transactions" 
            icon={History} 
            label="Transactions" 
            isActive={pathname.includes('/transactions')}
          />
          <SidebarLink 
            href="/settings" 
            icon={Settings} 
            label="Settings" 
            isActive={pathname.includes('/settings')}
          />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-sidebar-foreground/60">
        <div>ZK View Dashboard v1.0.0</div>
      </SidebarFooter>
    </Sidebar>
  );
};

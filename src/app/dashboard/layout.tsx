import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import ChatBotDrawer from "./_components/ChatBotDrawer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="size-10 rounded-full hover:bg-secondary text-foreground" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:inline">
                Fina Intelligence Hub
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-pale text-positive-deep text-xs font-semibold">
                <span className="size-2 rounded-full bg-positive animate-pulse" />
                <span>AI Connected</span>
              </div>
            </div>
          </div>
          {children}
        </div>
        <ChatBotDrawer />
      </main>
    </SidebarProvider>
  );
}

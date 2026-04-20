import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { role, profile } = useAuth();

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full overflow-hidden bg-[#020617]">

        {/* 🔹 SIDEBAR */}
        <AppSidebar />

        {/* 🔹 RIGHT SIDE */}
        <div className="flex-1 flex flex-col">

          {/* 🔹 HEADER */}
          <header className="h-14 flex items-center justify-between px-4 
                             bg-[#020617] border-b border-gray-800">

            {/* LEFT */}
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-gray-400 hover:text-white" />
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

              {/* ROLE BADGE */}
              <Badge 
                variant="outline" 
                className="capitalize font-normal 
                           border-gray-700 text-gray-300 bg-[#0f172a]"
              >
                {role || 'loading...'}
              </Badge>

              {/* THEME TOGGLE */}
              <ThemeToggle />

            </div>
          </header>

          {/* 🔹 MAIN CONTENT */}
          <main className="flex-1 p-6 overflow-auto bg-gray-100 rounded-tl-2xl">
            {children}
          </main>

        </div>
      </div>
    </SidebarProvider>
  );
};
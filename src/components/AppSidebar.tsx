import {
  BarChart3,
  LayoutDashboard,
  FolderKanban,
  Users,
  UserCog,
  Upload,
  Activity,
  LogOut
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";

// ✅ NAV ITEMS (exact like your screenshot)
const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Managers", url: "/managers", icon: UserCog },
  { title: "Employees", url: "/employees", icon: Users },
  { title: "Upload Data", url: "/upload", icon: Upload },
  { title: "Activity Log", url: "/activity", icon: Activity },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { role, profile, signOut } = useAuth();

  return (
    <Sidebar className="bg-[#0b1220] border-r border-gray-800" collapsible="icon">

      {/* 🔹 TOP */}
      <SidebarContent>

        {/* 🔹 LOGO */}
        <SidebarGroup>
          <div className="flex items-center gap-3 px-4 py-5">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>

            {!collapsed && (
              <span className="text-white font-semibold text-lg">
                ProjectHub
              </span>
            )}
          </div>
        </SidebarGroup>

        {/* 🔹 NAVIGATION */}
        <SidebarGroup>

          <SidebarGroupLabel className="text-gray-500 text-xs tracking-widest px-4 mb-3">
            {!collapsed && "NAVIGATION"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">

              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>

                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                          isActive
                            ? "bg-[#1e293b] text-blue-400"
                            : "text-gray-400 hover:bg-[#1e293b]/60 hover:text-white"
                        }`
                      }
                    >
                      {/* ICON */}
                      <item.icon className="h-5 w-5" />

                      {/* TEXT */}
                      {!collapsed && (
                        <span className="text-sm">
                          {item.title}
                        </span>
                      )}
                    </NavLink>

                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

            </SidebarMenu>
          </SidebarGroupContent>

        </SidebarGroup>

      </SidebarContent>

      {/* 🔹 FOOTER */}
      <SidebarFooter className="border-t border-gray-800 p-3">

        {!collapsed && (
          <div className="mb-2 px-1">
            <p className="text-sm font-medium text-white truncate">
              {profile?.full_name || "User"}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {role || "loading..."}
            </p>
          </div>
        )}

        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={signOut}
          className="w-full text-gray-400 hover:text-white hover:bg-[#1e293b]"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>

      </SidebarFooter>

    </Sidebar>
  );
}
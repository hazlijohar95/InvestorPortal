import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Newspaper, 
  Users, 
  FlagTriangleRight, 
  Folder, 
  Hand,
  LogOut,
  User,
} from "lucide-react";
import cyncoLogo from "@assets/cynco_logo_new.png";

const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    href: "/updates",
    label: "Updates",
    icon: Newspaper,
  },
  {
    href: "/cap-table",
    label: "Cap Table",
    icon: Users,
  },
  {
    href: "/timeline",
    label: "Timeline", 
    icon: FlagTriangleRight,
  },
  {
    href: "/documents",
    label: "Documents",
    icon: Folder,
  },
  {
    href: "/ask-board",
    label: "Ask Board",
    icon: Hand,
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart3,
    adminOnly: true,
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, isAdmin } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-80 bg-white border-r border-gray-200 transition-transform">
      <div className="h-full px-6 py-8 overflow-y-auto">
        {/* Logo */}
        <div className="mb-12">
          <img 
            src={cyncoLogo} 
            alt="Cynco" 
            className="h-8 w-auto object-contain mb-2"
          />
          <p className="text-sm text-gray-500">Investor Relations</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => {
            const isActive = location === item.href || (location === "/" && item.href === "/dashboard");
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-item flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "active bg-gray-100 text-black"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-8 left-6 right-6">
          <div className="space-y-3">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {isAdmin ? "Admin" : "Investor"}
                </p>
              </div>
            </div>
            
            <Button
              onClick={async () => {
                try {
                  await fetch('/api/logout', { method: 'POST', credentials: 'include' });
                  window.location.reload();
                } catch (error) {
                  console.error('Logout failed:', error);
                }
              }}
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

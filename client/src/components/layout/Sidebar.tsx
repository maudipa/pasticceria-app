import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BookOpen, 
  HelpCircle, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  PlusCircle
} from "lucide-react";

interface SidebarProps {
  className?: string;
  isVisible: boolean;
  onClose: () => void;
}

export function Sidebar({ className, isVisible, onClose }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: BookOpen, label: "Knowledge Base", href: "/knowledge-base" },
    { icon: HelpCircle, label: "FAQs", href: "/faqs" },
    { icon: Users, label: "Team", href: "/team" },
    { icon: MessageSquare, label: "Responses", href: "/responses" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const mobileClasses = isVisible
    ? "fixed inset-0 z-40 block"
    : "hidden";

  return (
    <>
      {/* Mobile backdrop */}
      {isVisible && (
        <div 
          className="fixed inset-0 bg-slate-600 bg-opacity-75 z-30 md:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "hidden md:flex md:w-64 md:flex-col",
        mobileClasses,
        className
      )}>
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-slate-200 dark:bg-sidebar dark:border-sidebar-border">
          {/* Mobile close button */}
          {isVisible && (
            <button 
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 md:hidden"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <PlusCircle className="w-8 h-8 mr-2 text-primary" />
            <span className="text-xl font-semibold text-slate-800 dark:text-slate-200">EventAssist</span>
          </div>

          {/* Navigation */}
          <div className="flex flex-col flex-grow px-4 mt-5">
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => isVisible && onClose()}
                  >
                    <a className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                      isActive 
                        ? "text-white bg-primary" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-sidebar-accent"
                    )}>
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </a>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User info */}
          <div className="p-4 mt-6 border-t border-slate-200 dark:border-sidebar-border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-medium leading-none text-white">SJ</span>
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Sarah Johnson</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Event Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;

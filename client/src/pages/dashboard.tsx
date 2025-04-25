import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import MobileNav from "@/components/dashboard/MobileNav";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentInquiries from "@/components/dashboard/RecentInquiries";
import QuickSearch from "@/components/dashboard/QuickSearch";
import QuickActions from "@/components/dashboard/QuickActions";
import InquiryTrends from "@/components/dashboard/InquiryTrends";
import TeamActivity from "@/components/dashboard/TeamActivity";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  showMobileMenu: boolean;
  toggleMobileMenu: () => void;
}

export default function Dashboard({ showMobileMenu, toggleMobileMenu }: DashboardProps) {
  const { toast } = useToast();

  const handleCreateResponse = () => {
    toast({
      title: "New Response",
      description: "Creating a new response template",
    });
  };

  useEffect(() => {
    document.title = "Dashboard | EventAssist";
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <Sidebar isVisible={showMobileMenu} onClose={toggleMobileMenu} />
      
      <MobileNav onMenuToggle={toggleMobileMenu} />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <main className="relative flex-1 overflow-y-auto focus:outline-none md:py-6 pt-16 md:pt-0">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <DashboardHeader 
              title="Dashboard" 
              description="Manage your event customer inquiries and automated responses"
              onActionClick={handleCreateResponse}
            />
            
            <StatsCards />
            
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <RecentInquiries />
              
              <div className="space-y-6">
                <QuickSearch />
                <QuickActions />
                <InquiryTrends />
              </div>
            </div>
            
            <TeamActivity />
          </div>
        </main>
      </div>
    </div>
  );
}

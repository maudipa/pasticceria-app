import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import MobileNav from "@/components/dashboard/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsProps {
  showMobileMenu: boolean;
  toggleMobileMenu: () => void;
}

export default function Analytics({ showMobileMenu, toggleMobileMenu }: AnalyticsProps) {
  const { toast } = useToast();

  const handleExportReports = () => {
    toast({
      title: "Export Reports",
      description: "Exporting analytics reports",
    });
  };

  useEffect(() => {
    document.title = "Analytics | EventAssist";
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <Sidebar isVisible={showMobileMenu} onClose={toggleMobileMenu} />
      
      <MobileNav onMenuToggle={toggleMobileMenu} />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <main className="relative flex-1 overflow-y-auto focus:outline-none md:py-6 pt-16 md:pt-0">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <DashboardHeader 
              title="Analytics" 
              description="View insights and statistics about customer inquiries"
              actionLabel="Export Reports"
              onActionClick={handleExportReports}
            />
            
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Inquiry Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Analytics dashboard will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

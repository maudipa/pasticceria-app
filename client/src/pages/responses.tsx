import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import MobileNav from "@/components/dashboard/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ResponsesProps {
  showMobileMenu: boolean;
  toggleMobileMenu: () => void;
}

export default function Responses({ showMobileMenu, toggleMobileMenu }: ResponsesProps) {
  const { toast } = useToast();

  const handleCreateResponse = () => {
    toast({
      title: "New Response",
      description: "Creating a new response template",
    });
  };

  useEffect(() => {
    document.title = "Responses | EventAssist";
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <Sidebar isVisible={showMobileMenu} onClose={toggleMobileMenu} />
      
      <MobileNav onMenuToggle={toggleMobileMenu} />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <main className="relative flex-1 overflow-y-auto focus:outline-none md:py-6 pt-16 md:pt-0">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <DashboardHeader 
              title="Responses" 
              description="Manage customer responses and templates"
              onActionClick={handleCreateResponse}
            />
            
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Response Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Response templates will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

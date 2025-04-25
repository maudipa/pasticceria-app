import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { PlusCircle } from "lucide-react";

interface MobileNavProps {
  onMenuToggle: () => void;
}

export function MobileNav({ onMenuToggle }: MobileNavProps) {
  return (
    <div className="md:hidden fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 dark:bg-sidebar dark:border-sidebar-border">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
        <div className="flex items-center flex-shrink-0 ml-2">
          <PlusCircle className="w-8 h-8 mr-2 text-primary" />
          <span className="text-xl font-semibold text-slate-800 dark:text-slate-200">EventAssist</span>
        </div>
      </div>
      <div>
        <div className="flex-shrink-0">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-medium leading-none text-white">SJ</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default MobileNav;

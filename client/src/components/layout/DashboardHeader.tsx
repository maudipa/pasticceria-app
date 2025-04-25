import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export function DashboardHeader({
  title,
  description,
  actionLabel = "New Response",
  onActionClick,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {onActionClick && (
        <div className="mt-4 flex sm:mt-0">
          <Button onClick={onActionClick} className="inline-flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default DashboardHeader;

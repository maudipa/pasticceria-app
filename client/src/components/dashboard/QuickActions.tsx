import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  FileText, 
  HelpCircle, 
  UserPlus, 
  Download 
} from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      icon: FileText,
      title: "Create KB Article",
      description: "Add new information to knowledge base",
      href: "/knowledge-base/new",
      color: "bg-indigo-100 text-primary dark:bg-indigo-900",
      hoverColor: "group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800"
    },
    {
      icon: HelpCircle,
      title: "Create FAQ Response",
      description: "Add new automated response",
      href: "/faqs/new",
      color: "bg-emerald-100 text-secondary dark:bg-emerald-900",
      hoverColor: "group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800"
    },
    {
      icon: UserPlus,
      title: "Invite Team Member",
      description: "Add new colleague to collaborate",
      href: "/team/invite",
      color: "bg-amber-100 text-warning dark:bg-amber-900",
      hoverColor: "group-hover:bg-amber-200 dark:group-hover:bg-amber-800"
    },
    {
      icon: Download,
      title: "Export Reports",
      description: "Download inquiry analytics",
      href: "/analytics/export",
      color: "bg-blue-100 text-info dark:bg-blue-900",
      hoverColor: "group-hover:bg-blue-200 dark:group-hover:bg-blue-800"
    }
  ];

  return (
    <Card className="shadow rounded-lg">
      <CardHeader className="px-4 py-5 border-b border-slate-200 dark:border-slate-700 sm:px-6">
        <CardTitle className="text-lg font-medium text-slate-800 dark:text-slate-200">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:p-6">
        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          {actions.map((action, index) => (
            <li key={index} className="py-2">
              <Link href={action.href}>
                <a className="group flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-2 ${action.color} transition-colors ${action.hoverColor}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-200">
                      {action.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {action.description}
                    </p>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default QuickActions;

import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Stats } from "@/lib/types";
import { MessageSquare, Bot, Clock, BookOpen } from "lucide-react";

export function StatsCards() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['/api/stats'],
  });

  const statsCards = [
    {
      title: "Inquiries Today",
      value: stats?.inquiriesToday || 0,
      icon: MessageSquare,
      color: "bg-indigo-100 text-primary",
    },
    {
      title: "Auto-Responses",
      value: `${stats?.autoResponseRate || 0}%`,
      icon: Bot,
      color: "bg-emerald-100 text-secondary",
    },
    {
      title: "Pending Inquiries",
      value: stats?.pendingInquiries || 0,
      icon: Clock,
      color: "bg-amber-100 text-warning",
    },
    {
      title: "KB Articles",
      value: stats?.kbArticles || 0,
      icon: BookOpen,
      color: "bg-blue-100 text-info",
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((card, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate dark:text-slate-400">{card.title}</dt>
                    <dd>
                      <div className="text-lg font-medium text-slate-900 dark:text-slate-200">
                        {isLoading ? (
                          <div className="h-7 w-14 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
                        ) : (
                          card.value
                        )}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default StatsCards;

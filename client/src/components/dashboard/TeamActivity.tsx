import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export function TeamActivity() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activity/recent'],
  });

  return (
    <Card className="mt-8 shadow rounded-lg">
      <CardHeader className="px-4 py-5 border-b border-slate-200 dark:border-slate-700 sm:px-6 flex justify-between items-center">
        <CardTitle className="text-lg font-medium text-slate-800 dark:text-slate-200">Team Activity</CardTitle>
        <Button variant="outline" size="sm" className="text-xs">
          View All Activity
        </Button>
      </CardHeader>
      <CardContent className="py-4 px-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <li key={i}>
                  <div className="relative pb-8">
                    {i < 2 && (
                      <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-700" aria-hidden="true"></span>
                    )}
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <Skeleton className="h-10 w-10 rounded-full" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm">
                            <Skeleton className="h-5 w-24" />
                          </div>
                          <p className="mt-0.5 text-sm text-slate-500">
                            <Skeleton className="h-4 w-16" />
                          </p>
                        </div>
                        <div className="mt-2 text-sm text-slate-700">
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              activities?.map((activity, index) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index < activities.length - 1 && (
                      <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-700" aria-hidden="true"></span>
                    )}
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10 bg-slate-200 text-slate-800 flex items-center justify-center ring-8 ring-white dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-900">
                          <AvatarFallback>
                            {typeof activity.details === 'object' && activity.details && 'userName' in activity.details
                              ? (activity.details.userName as string).substring(0, 2)
                              : 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm">
                            <a href="#" className="font-medium text-slate-900 dark:text-slate-200">
                              {typeof activity.details === 'object' && activity.details && 'userName' in activity.details
                                ? activity.details.userName
                                : 'User'}
                            </a>
                          </div>
                          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                          <p>
                            {activity.action === 'created' && 
                              `Created a new ${activity.resourceType.replace('_', ' ')} about `}
                            {activity.action === 'updated' && 
                              `Updated the ${activity.resourceType.replace('_', ' ')} on `}
                            {activity.action === 'responded' && 
                              `Responded to ${activity.resourceType.replace('_', ' ')} from `}
                            
                            <span className="font-medium">
                              {typeof activity.details === 'object' && activity.details && (
                                (activity.details.title || 
                                 activity.details.question || 
                                 activity.details.customerName || 
                                 'item')
                              )}
                            </span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default TeamActivity;

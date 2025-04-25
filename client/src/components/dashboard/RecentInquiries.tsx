import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { Inquiry } from "@/lib/types";
import { Edit, Send, Reply, UserPlus2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export function RecentInquiries() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: inquiries, isLoading } = useQuery<Inquiry[]>({
    queryKey: ['/api/inquiries/recent'],
  });

  const statusColors: Record<string, string> = {
    "auto-resolved": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "pending": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "needs-review": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    "resolved": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  };

  return (
    <Card className="shadow rounded-lg lg:col-span-2">
      <CardHeader className="px-4 py-5 border-b border-slate-200 dark:border-slate-700 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-slate-800 dark:text-slate-200">Recent Inquiries</CardTitle>
          <div className="flex space-x-2">
            <div className="relative">
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="ticket">Ticket Information</SelectItem>
                  <SelectItem value="venue">Venue Details</SelectItem>
                  <SelectItem value="refunds">Refunds</SelectItem>
                  <SelectItem value="accessibility">Accessibility</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <div>
        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="ml-4">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-32 mt-1" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </div>
                </div>
                <div className="mt-2">
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="mt-2 flex">
                  <Skeleton className="h-8 w-24 rounded-md mr-2" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </li>
            ))
          ) : (
            inquiries?.map((inquiry) => (
              <li key={inquiry.id} className="px-4 py-4 sm:px-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900">
                        <span className="text-sm font-medium leading-none text-primary">
                          {inquiry.customerName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-200">{inquiry.customerName}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{inquiry.customerEmail}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className={statusColors[inquiry.status]}>
                      {inquiry.status === "auto-resolved" ? "Auto-Resolved" : 
                       inquiry.status === "needs-review" ? "Needs Review" : 
                       inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                    </Badge>
                    <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                      {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {inquiry.message}
                  </p>
                </div>
                {inquiry.responseMessage && (
                  <div className="mt-2 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800 rounded p-2 border-l-2 border-primary">
                    <p>{inquiry.responseMessage}</p>
                  </div>
                )}
                <div className="mt-2 flex">
                  {inquiry.status === "auto-resolved" || inquiry.status === "resolved" ? (
                    <>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                        <Edit className="mr-1 h-3.5 w-3.5" />
                        Edit Response
                      </Button>
                      <Button variant="ghost" size="sm" className="ml-2 h-8 px-2 text-xs">
                        <Send className="mr-1 h-3.5 w-3.5" />
                        Send Follow-Up
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" className="h-8 px-2 text-xs">
                        <Reply className="mr-1 h-3.5 w-3.5" />
                        Respond
                      </Button>
                      <Button variant="ghost" size="sm" className="ml-2 h-8 px-2 text-xs">
                        <UserPlus2 className="mr-1 h-3.5 w-3.5" />
                        Assign
                      </Button>
                    </>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-medium">3</span> of <span className="font-medium">25</span> inquiries
          </div>
          <div className="flex-1 flex justify-between sm:justify-end">
            <Button variant="outline" size="sm" className="relative">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="ml-3 relative">
              Next
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default RecentInquiries;

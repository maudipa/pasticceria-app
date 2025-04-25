import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export function QuickSearch() {
  const popularSearches = [
    "Refunds",
    "Parking",
    "Venue map",
    "Accessibility"
  ];

  return (
    <Card className="shadow rounded-lg">
      <CardHeader className="px-4 py-5 border-b border-slate-200 dark:border-slate-700 sm:px-6">
        <CardTitle className="text-lg font-medium text-slate-800 dark:text-slate-200">Quick Search</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <Input 
            type="text" 
            placeholder="Search knowledge base..."
            className="pl-10"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Popular searches:</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {popularSearches.map((search, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {search}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default QuickSearch;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export function InquiryTrends() {
  // Sample data for chart visualization
  const chartData = [
    { name: "Mon", inquiries: 12 },
    { name: "Tue", inquiries: 19 },
    { name: "Wed", inquiries: 15 },
    { name: "Thu", inquiries: 22 },
    { name: "Fri", inquiries: 30 },
    { name: "Sat", inquiries: 18 },
    { name: "Sun", inquiries: 10 },
  ];

  const categories = [
    { name: "Ticket Information", value: 42, color: "bg-primary" },
    { name: "Event Schedule", value: 28, color: "bg-secondary" },
    { name: "Venue Details", value: 15, color: "bg-accent" },
    { name: "Other", value: 15, color: "bg-info" },
  ];

  return (
    <Card className="shadow rounded-lg">
      <CardHeader className="px-4 py-5 border-b border-slate-200 dark:border-slate-700 sm:px-6">
        <CardTitle className="text-lg font-medium text-slate-800 dark:text-slate-200">Inquiry Trends</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="h-48 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
                fontSize={12}
                className="text-slate-500 dark:text-slate-400"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                fontSize={12}
                className="text-slate-500 dark:text-slate-400"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  color: 'hsl(var(--foreground))',
                  fontSize: '0.875rem',
                }}
              />
              <Bar 
                dataKey="inquiries" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Top inquiry categories:</h3>
          <ul className="mt-2 space-y-2">
            {categories.map((category, index) => (
              <li key={index} className="flex items-center text-sm">
                <span className={`w-2 h-2 ${category.color} rounded-full mr-2`}></span>
                <span className="text-slate-700 dark:text-slate-300">{category.name}</span>
                <span className="ml-auto font-medium text-slate-900 dark:text-slate-200">{category.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default InquiryTrends;

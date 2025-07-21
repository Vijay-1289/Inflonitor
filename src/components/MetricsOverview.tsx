import { TrendingUp, Users, Eye, MessageSquare, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

const MetricCard = ({ title, value, change, trend, icon }: MetricCardProps) => {
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500";
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
        <div className={`text-sm font-medium ${trendColor} flex items-center space-x-1`}>
          <TrendingUp className="w-4 h-4" />
          <span>{change}</span>
        </div>
      </div>
    </Card>
  );
};

export const MetricsOverview = () => {
  const metrics = [
    {
      title: "Active Influencers",
      value: "247",
      change: "+12%",
      trend: "up" as const,
      icon: <Users className="w-5 h-5 text-purple-500" />
    },
    {
      title: "Total Mentions",
      value: "1,853",
      change: "+8.2%",
      trend: "up" as const,
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />
    },
    {
      title: "Reach",
      value: "2.4M",
      change: "+15.7%",
      trend: "up" as const,
      icon: <Eye className="w-5 h-5 text-green-500" />
    },
    {
      title: "Engagement Rate",
      value: "4.2%",
      change: "-0.8%",
      trend: "down" as const,
      icon: <Zap className="w-5 h-5 text-red-500" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}; 
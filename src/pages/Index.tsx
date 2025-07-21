import { MetricsOverview } from "@/components/MetricsOverview";
import { RecentReports } from "@/components/RecentReports";
import { TrendingTopics } from "@/components/TrendingTopics";
import GoogleSheetData from "@/components/GoogleSheetData";

const Index = () => {
  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">Monitor your brand's social media presence across all platforms</p>
        </div>
        <MetricsOverview />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <TrendingTopics />
          </div>
          <div className="col-span-3">
            <RecentReports />
          </div>
        </div>
        <GoogleSheetData />
      </div>
    </div>
  );
};

export default Index;

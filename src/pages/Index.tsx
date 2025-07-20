import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricsOverview } from "@/components/MetricsOverview";
import { TrendingTopics } from "@/components/TrendingTopics";
import { InfluencerList } from "@/components/InfluencerList";
import { RecentReports } from "@/components/RecentReports";
import { WorkflowTrigger } from "@/components/WorkflowTrigger";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <DashboardHeader />
      
      <main className="p-6 space-y-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">Monitor your brand's social media presence across all platforms</p>
        </div>

        <WorkflowTrigger />

        <MetricsOverview />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TrendingTopics />
          <RecentReports />
        </div>

        <InfluencerList />
      </main>
    </div>
  );
};

export default Index;

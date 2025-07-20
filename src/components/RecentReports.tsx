import { FileText, Calendar, Download, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchAllTrends } from "@/lib/trendApis";
import { saveAs } from "file-saver";

interface Report {
  id: string;
  title: string;
  date: string;
  status: "completed" | "processing" | "scheduled";
  insights: number;
  mentions: number;
  platforms: string[];
  type: "weekly" | "trend-alert" | "competitive";
}

export const RecentReports = () => {
  const { data: trends, isLoading, isError } = useQuery({
    queryKey: ["recent-trends-report"],
    queryFn: fetchAllTrends,
    refetchInterval: 1000 * 60 * 60 * 48, // 48 hours
  });

  // Generate a summary reason for each trend (placeholder logic)
  const getReason = (topic: any) => {
    if (topic.growth > 30) return "Rapid growth due to viral content or news.";
    if (topic.sentiment === "positive") return "Positive sentiment driving engagement.";
    if (topic.platforms.includes("LinkedIn")) return "Professional discussions boosting visibility.";
    return "Consistent engagement across platforms.";
  };

  // Download report as CSV
  const downloadReport = () => {
    if (!trends) return;
    const header = "Topic,Platforms,Mentions,Growth (%),Engagement (%),Sentiment,Reason\n";
    const rows = trends.map((t: any) =>
      [
        `"${t.topic.replace(/"/g, '""')}"`,
        t.platforms.join("/"),
        t.mentions,
        t.growth?.toFixed(1) ?? 0,
        t.engagement,
        t.sentiment,
        `"${getReason(t)}"`
      ].join(",")
    );
    const csv = header + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `trends-report-${new Date().toISOString().slice(0,10)}.csv`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success text-success-foreground";
      case "processing": return "bg-warning text-warning-foreground";
      case "scheduled": return "bg-info text-info-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "weekly": return "📊";
      case "trend-alert": return "🔥";
      case "competitive": return "⚔️";
      default: return "📄";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Recent Trend Reports</h3>
        </div>
        <Button variant="outline" size="sm" onClick={downloadReport} disabled={!trends || isLoading}>
          <Download className="w-4 h-4 mr-2" />
          Download CSV
        </Button>
      </div>
      {isLoading && <div className="text-center text-muted-foreground py-8">Generating report...</div>}
      {isError && <div className="text-center text-destructive py-8">Failed to generate report. Please try again later.</div>}
      <div className="space-y-4">
        {trends && trends.map((trend: any, idx: number) => (
          <div key={idx} className="p-4 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">{trend.topic}</h4>
              <span className="text-xs text-muted-foreground">{trend.platforms.join(", ")}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Mentions: {trend.mentions}</span>
              <span className="text-xs text-muted-foreground">Growth: {trend.growth?.toFixed(1) ?? 0}%</span>
              <span className="text-xs text-muted-foreground">Engagement: {trend.engagement}%</span>
              <span className="text-xs text-muted-foreground">Sentiment: {trend.sentiment}</span>
            </div>
            <div className="text-xs text-info-foreground mt-1">Reason: {getReason(trend)}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};
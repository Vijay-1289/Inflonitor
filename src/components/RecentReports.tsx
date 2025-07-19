import { FileText, Calendar, Download, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const reports: Report[] = [
    {
      id: "1",
      title: "Weekly Brand Monitoring Report",
      date: "2024-01-15",
      status: "completed",
      insights: 23,
      mentions: 456,
      platforms: ["Instagram", "YouTube", "LinkedIn"],
      type: "weekly"
    },
    {
      id: "2",
      title: "Sustainable Fashion Trend Alert",
      date: "2024-01-14",
      status: "completed",
      insights: 8,
      mentions: 127,
      platforms: ["Instagram", "TikTok"],
      type: "trend-alert"
    },
    {
      id: "3",
      title: "Competitor Analysis - Fashion Week",
      date: "2024-01-13",
      status: "processing",
      insights: 0,
      mentions: 89,
      platforms: ["Instagram", "YouTube"],
      type: "competitive"
    },
    {
      id: "4",
      title: "Weekly Brand Monitoring Report",
      date: "2024-01-17",
      status: "scheduled",
      insights: 0,
      mentions: 0,
      platforms: ["Instagram", "YouTube", "LinkedIn"],
      type: "weekly"
    }
  ];

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
          <h3 className="text-lg font-semibold text-foreground">Recent Reports</h3>
        </div>
        <Button variant="outline" size="sm">
          View All Reports
        </Button>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="p-4 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getTypeIcon(report.type)}</span>
                <div>
                  <h4 className="font-medium text-foreground">{report.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{report.date}</span>
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(report.status)}>
                {report.status}
              </Badge>
            </div>

            {report.status === "completed" && (
              <div className="flex items-center justify-between mb-3">
                <div className="flex space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{report.insights}</p>
                    <p className="text-xs text-muted-foreground">Insights</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{report.mentions}</p>
                    <p className="text-xs text-muted-foreground">Mentions</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex space-x-1">
              {report.platforms.map((platform) => (
                <Badge key={platform} variant="outline" className="text-xs">
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
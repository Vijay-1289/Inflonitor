import { Hash, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { fetchAllTrends } from "@/lib/trendApis";

interface TrendingTopic {
  topic: string;
  mentions: number;
  growth: number;
  sentiment: "positive" | "negative" | "neutral";
  platforms: string[];
  engagement: number;
}

export const TrendingTopics = () => {
  const { data: topics, isLoading, isError } = useQuery({
    queryKey: ["trending-topics"],
    queryFn: fetchAllTrends,
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-success";
      case "negative": return "bg-destructive";
      default: return "bg-muted-foreground";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Hash className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Trending Topics</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Last 48 hours</span>
        </div>
      </div>

      {isLoading && <div className="text-center text-muted-foreground py-8">Loading trends...</div>}
      {isError && <div className="text-center text-destructive py-8">Failed to load trends. Please try again later.</div>}
      <div className="space-y-4">
        {topics && topics.map((topic: any, index: number) => (
          <div key={index} className="p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getSentimentColor(topic.sentiment)}`}></div>
                <h4 className="font-medium text-foreground">{topic.topic}</h4>
                <div className="flex items-center space-x-1 text-success text-sm">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{topic.growth?.toFixed(1) ?? 0}%</span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{topic.mentions} mentions</span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex space-x-1">
                {topic.platforms.map((platform: string) => (
                  <Badge key={platform} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{topic.engagement}% engagement</span>
            </div>
            
            <Progress value={topic.engagement} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
};
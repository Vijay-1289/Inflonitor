import { Hash, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TrendingTopic {
  topic: string;
  mentions: number;
  growth: number;
  sentiment: "positive" | "negative" | "neutral";
  platforms: string[];
  engagement: number;
}

export const TrendingTopics = () => {
  const topics: TrendingTopic[] = [
    {
      topic: "Sustainable Fashion",
      mentions: 342,
      growth: 45.2,
      sentiment: "positive",
      platforms: ["Instagram", "TikTok"],
      engagement: 87
    },
    {
      topic: "AI Technology",
      mentions: 289,
      growth: 32.1,
      sentiment: "positive",
      platforms: ["LinkedIn", "Twitter"],
      engagement: 73
    },
    {
      topic: "Workout Routines",
      mentions: 156,
      growth: 18.7,
      sentiment: "neutral",
      platforms: ["Instagram", "YouTube"],
      engagement: 65
    },
    {
      topic: "Plant-based Diet",
      mentions: 124,
      growth: 12.3,
      sentiment: "positive",
      platforms: ["Instagram", "TikTok"],
      engagement: 58
    }
  ];

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

      <div className="space-y-4">
        {topics.map((topic, index) => (
          <div key={index} className="p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getSentimentColor(topic.sentiment)}`}></div>
                <h4 className="font-medium text-foreground">{topic.topic}</h4>
                <div className="flex items-center space-x-1 text-success text-sm">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{topic.growth}%</span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{topic.mentions} mentions</span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex space-x-1">
                {topic.platforms.map((platform) => (
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